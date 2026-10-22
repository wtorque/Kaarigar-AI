import { FastifyInstance } from 'fastify';
import { searchHandler } from './search.controller.js';

export async function searchRoutes(fastify: FastifyInstance) {
  fastify.get('/search', searchHandler);
}
