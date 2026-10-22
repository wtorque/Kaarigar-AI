import { FastifyInstance } from 'fastify';
import {
  getWishlistHandler,
  addWishlistItemHandler,
  removeWishlistItemHandler,
} from './wishlist.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function wishlistRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/wishlist', getWishlistHandler);
  fastify.post('/wishlist/items', addWishlistItemHandler);
  fastify.delete('/wishlist/items/:productId', removeWishlistItemHandler);
}
