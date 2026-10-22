import { FastifyInstance } from 'fastify';
import {
  createOrderHandler,
  listOrdersHandler,
  getOrderByIdHandler,
  cancelOrderHandler,
} from './order.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/orders', listOrdersHandler);
  fastify.get('/orders/:id', getOrderByIdHandler);
  fastify.post('/orders', createOrderHandler);
  fastify.post('/orders/:id/cancel', cancelOrderHandler);
}
