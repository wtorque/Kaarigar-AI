import { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from '../orders/order.service.js';
import { paymentService } from './payment.service.js';
import { createCheckoutOrderSchema } from '../orders/order.schema.js';

export async function checkoutHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user!;
  const parsed = createCheckoutOrderSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid checkout parameters',
        details: parsed.error.issues,
      },
    });
  }

  const idempotencyKey = request.headers['idempotency-key'] as string | undefined;

  try {
    const result = await orderService.createCheckoutOrder(user, parsed.data, idempotencyKey);
    return reply.status(200).send({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed';
    const status = message.includes('CONFLICT') ? 409 : message.includes('NOT_FOUND') ? 404 : 500;
    return reply.status(status).send({
      success: false,
      error: {
        code: message.includes('CONFLICT') ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
        message,
      },
    });
  }
}

export async function paymentWebhookHandler(request: FastifyRequest, reply: FastifyReply) {
  const signature = (request.headers['x-razorpay-signature'] ||
    request.headers['stripe-signature'] ||
    request.headers['x-webhook-signature'] ||
    '') as string;

  const rawBody = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
  const payload = request.body as {
    eventId: string;
    eventType: string;
    orderId?: string;
    providerPaymentId?: string;
    amountMinor?: number;
  };

  try {
    const result = await paymentService.processWebhookEvent(
      'SANDBOX',
      signature,
      rawBody,
      payload
    );
    return reply.send({ ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook processing error';
    const status = message.includes('UNAUTHORIZED') ? 401 : 400;
    return reply.status(status).send({
      success: false,
      error: { code: message.includes('UNAUTHORIZED') ? 'UNAUTHORIZED' : 'BAD_REQUEST', message },
    });
  }
}
