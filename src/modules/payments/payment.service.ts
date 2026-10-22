import { prisma } from '../../infrastructure/postgres/client.js';
import { paymentProvider } from '../../infrastructure/payments/provider.js';
import { inventoryService } from '../inventory/inventory.service.js';
import { logger } from '../../config/logger.js';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class PaymentService {
  async processWebhookEvent(
    provider: string,
    signature: string,
    rawBody: string,
    payload: {
      eventId: string;
      eventType: string;
      orderId?: string;
      providerPaymentId?: string;
      amountMinor?: number;
    }
  ) {
    // 1. Cryptographic Signature Verification
    const isValidSignature = paymentProvider.verifyWebhookSignature(rawBody, signature);
    if (!isValidSignature) {
      logger.warn({ provider, eventId: payload.eventId }, 'Invalid payment webhook signature');
      throw new Error('UNAUTHORIZED: Invalid webhook cryptographic signature');
    }

    // 2. Deduplication check in PaymentWebhookEvent
    const existingEvent = await prisma.paymentWebhookEvent.findUnique({
      where: {
        provider_eventId: {
          provider,
          eventId: payload.eventId,
        },
      },
    });

    if (existingEvent && existingEvent.processed) {
      logger.info({ provider, eventId: payload.eventId }, 'Webhook event already processed (idempotent duplicate)');
      return { success: true, duplicate: true };
    }

    // 3. Record or update webhook event
    await prisma.paymentWebhookEvent.upsert({
      where: {
        provider_eventId: {
          provider,
          eventId: payload.eventId,
        },
      },
      update: {},
      create: {
        provider,
        eventId: payload.eventId,
        eventType: payload.eventType,
        payload: payload as unknown as object,
        processed: false,
      },
    });

    // 4. Handle Payment Succeeded Event
    if (payload.eventType === 'payment.captured' || payload.eventType === 'payment_intent.succeeded' || payload.eventType === 'order.paid') {
      await this.handlePaymentSuccess(payload.orderId, payload.providerPaymentId);
    }

    // Mark event as processed
    await prisma.paymentWebhookEvent.update({
      where: {
        provider_eventId: {
          provider,
          eventId: payload.eventId,
        },
      },
      data: { processed: true },
    });

    return { success: true, duplicate: false };
  }

  private async handlePaymentSuccess(orderId?: string, providerPaymentId?: string) {
    if (!orderId && !providerPaymentId) {
      logger.warn('Payment success webhook received without orderId or providerPaymentId');
      return;
    }

    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { payments: { some: { providerPaymentId } } },
      include: { items: true, user: true },
    });

    if (!order) {
      logger.warn({ orderId, providerPaymentId }, 'Order not found for payment success webhook');
      return;
    }

    if (order.status === OrderStatus.PAYMENT_CONFIRMED) {
      return; // Already confirmed
    }

    await prisma.$transaction(async (tx) => {
      // 1. Move Order to PAYMENT_CONFIRMED
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAYMENT_CONFIRMED },
      });

      // 2. Update Payment record to SUCCEEDED
      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: { status: PaymentStatus.SUCCEEDED },
      });

      // 3. Finalize inventory reservations (permanently reduces reserved stock)
      const itemsToFinalize = order.items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      }));
      await inventoryService.finalizeBatch(itemsToFinalize);

      // 4. Create in-app notification for Customer
      await tx.notification.create({
        data: {
          userId: order.userId,
          type: 'ORDER_STATUS',
          title: 'Payment Confirmed',
          message: `Your payment for Order #${order.orderNumber} was confirmed. Your handcrafted items are now being prepared by the artisans.`,
          linkUrl: `/orders/${order.id}`,
        },
      });

      // 5. Notify Artisans involved in this order
      const artisanIds = [...new Set(order.items.map((i) => i.artisanId))];
      for (const artId of artisanIds) {
        const artisan = await tx.artisanProfile.findUnique({
          where: { id: artId },
          select: { userId: true },
        });

        if (artisan) {
          await tx.notification.create({
            data: {
              userId: artisan.userId,
              type: 'ORDER_STATUS',
              title: 'New Craft Order Received!',
              message: `You have received a new paid order (Order #${order.orderNumber}). Prepare items for dispatch.`,
              linkUrl: `/artisans/orders/${order.id}`,
            },
          });
        }
      }
    });

    logger.info({ orderId: order.id, orderNumber: order.orderNumber }, 'Order marked as PAYMENT_CONFIRMED');
  }
}

export const paymentService = new PaymentService();
