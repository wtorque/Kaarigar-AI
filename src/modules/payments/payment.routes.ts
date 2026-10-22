import { FastifyInstance } from 'fastify';
import { checkoutHandler, paymentWebhookHandler } from './payment.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function paymentRoutes(fastify: FastifyInstance) {
  // Checkout requires authentication
  fastify.post(
    '/payments/checkout',
    { preHandler: [authenticate] },
    checkoutHandler
  );

  // Webhook is public to payment provider, authenticated via cryptographic signature
  fastify.post('/webhooks/payments', paymentWebhookHandler);
}
