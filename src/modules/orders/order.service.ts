import crypto from 'node:crypto';
import { orderRepository, OrderRepository } from './order.repository.js';
import { CreateCheckoutOrderInput, QueryOrdersInput } from './order.schema.js';
import { inventoryService } from '../inventory/inventory.service.js';
import { paymentProvider } from '../../infrastructure/payments/provider.js';
import { prisma } from '../../infrastructure/postgres/client.js';
import { AuthenticatedUser } from '../../types/fastify.js';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { cartRepository } from '../carts/cart.repository.js';

export class OrderService {
  constructor(private orderRepo: OrderRepository = orderRepository) {}

  async createCheckoutOrder(user: AuthenticatedUser, input: CreateCheckoutOrderInput, idempotencyKey?: string) {
    // 1. Check Idempotency Key
    if (idempotencyKey) {
      const existing = await this.orderRepo.findByIdempotencyKey(idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    // 2. Fetch all variants to verify real-time prices & artisan ownership
    const variantIds = input.items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: { select: { title: true, artisanId: true } },
      },
    });

    if (variants.length !== input.items.length) {
      throw new Error('NOT_FOUND: One or more selected product variants could not be found');
    }

    // 3. Atomically reserve inventory
    const reservationItems = input.items.map((i) => ({
      variantId: i.variantId,
      quantity: i.quantity,
    }));

    const reservationResult = await inventoryService.reserveBatch(reservationItems);
    if (!reservationResult.success) {
      throw new Error(`CONFLICT: Insufficient stock available for variant ${reservationResult.failedVariantId}`);
    }

    // 4. Calculate prices in integer minor units
    let subtotalMinor = 0;
    const orderLineItems = input.items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      const unitPriceMinor = variant.priceMinor;
      const totalAmountMinor = unitPriceMinor * item.quantity;
      subtotalMinor += totalAmountMinor;

      return {
        variantId: variant.id,
        artisanId: variant.product.artisanId,
        productTitle: variant.product.title,
        variantTitle: variant.title,
        unitPriceMinor,
        quantity: item.quantity,
        totalAmountMinor,
      };
    });

    const taxMinor = Math.round(subtotalMinor * 0.05); // 5% GST
    const shippingFeeMinor = subtotalMinor > 100000 ? 0 : 9900; // Free above ₹1000
    const totalAmountMinor = subtotalMinor + taxMinor + shippingFeeMinor;

    // 5. Generate human-readable order number
    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderNumber = `KRG-${dateStr}-${randomSuffix}`;

    // 6. Create Order and Payment in database
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: user.id,
          shippingAddressId: input.shippingAddressId,
          orderNumber,
          subtotalMinor,
          taxMinor,
          shippingFeeMinor,
          totalAmountMinor,
          idempotencyKey,
          status: OrderStatus.PENDING_PAYMENT,
          items: {
            create: orderLineItems,
          },
        },
        include: { items: true, shippingAddress: true },
      });

      // Clear the user's cart now that checkout order is placed
      await cartRepository.clearCart(user.id);

      return createdOrder;
    });

    // 7. Initialize Payment Session
    const paymentSession = await paymentProvider.createCheckoutSession(
      order.id,
      totalAmountMinor,
      'INR'
    );

    // Save payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: paymentSession.provider,
        providerPaymentId: paymentSession.paymentId,
        providerOrderId: paymentSession.providerReferenceId,
        amountMinor: totalAmountMinor,
        currency: 'INR',
        status: PaymentStatus.CREATED,
      },
    });

    return {
      order,
      payment,
      paymentSession,
    };
  }

  async getOrderById(orderId: string, user: AuthenticatedUser) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new Error('NOT_FOUND: Order not found');
    }

    const isCustomer = order.userId === user.id;
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    const isArtisan = user.artisanProfile && order.items.some((i) => i.artisanId === user.artisanProfile!.id);

    if (!isCustomer && !isAdmin && !isArtisan) {
      throw new Error('FORBIDDEN: You do not have permission to view this order');
    }

    // If artisan, filter only their line items
    if (isArtisan && !isAdmin && !isCustomer) {
      return {
        ...order,
        items: order.items.filter((i) => i.artisanId === user.artisanProfile!.id),
      };
    }

    return order;
  }

  async listOrders(user: AuthenticatedUser, query: QueryOrdersInput) {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return this.orderRepo.findMany({
        status: query.status,
        page: query.page,
        limit: query.limit,
      });
    }

    if (user.role === 'ARTISAN' && user.artisanProfile) {
      return this.orderRepo.findMany({
        artisanId: user.artisanProfile.id,
        status: query.status,
        page: query.page,
        limit: query.limit,
      });
    }

    // Default: customer orders
    return this.orderRepo.findMany({
      userId: user.id,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  }

  async cancelOrder(orderId: string, user: AuthenticatedUser) {
    const order = await this.getOrderById(orderId, user);

    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
      throw new Error(`CONFLICT: Cannot cancel an order with status: ${order.status}`);
    }

    // Release stock
    const itemsToRelease = order.items.map((i) => ({
      variantId: i.variantId,
      quantity: i.quantity,
    }));

    await inventoryService.releaseBatch(itemsToRelease);
    const updated = await this.orderRepo.updateOrderStatus(orderId, OrderStatus.CANCELLED);

    return updated;
  }
}

export const orderService = new OrderService();
