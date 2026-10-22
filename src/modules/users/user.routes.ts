import { FastifyInstance } from 'fastify';
import {
  getMeHandler,
  updateMeHandler,
  listAddressesHandler,
  createAddressHandler,
  deleteAddressHandler,
} from './user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function userRoutes(fastify: FastifyInstance) {
  // All user profile and address routes require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.get('/me', getMeHandler);
  fastify.patch('/me', updateMeHandler);
  fastify.get('/me/addresses', listAddressesHandler);
  fastify.post('/me/addresses', createAddressHandler);
  fastify.delete('/me/addresses/:id', deleteAddressHandler);
}
