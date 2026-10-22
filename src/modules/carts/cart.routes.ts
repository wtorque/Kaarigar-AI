import { FastifyInstance } from 'fastify';
import {
  getCartHandler,
  addCartItemHandler,
  updateCartItemHandler,
  removeCartItemHandler,
} from './cart.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function cartRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/cart', getCartHandler);
  fastify.post('/cart/items', addCartItemHandler);
  fastify.patch('/cart/items/:id', updateCartItemHandler);
  fastify.delete('/cart/items/:id', removeCartItemHandler);
}
