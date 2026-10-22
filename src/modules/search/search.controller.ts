import { FastifyRequest, FastifyReply } from 'fastify';
import { searchService } from './search.service.js';

export async function searchHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = request.query as { q?: string; limit?: number };
  const q = query.q || '';
  const limit = Math.min(Number(query.limit) || 20, 50);

  const results = await searchService.search(q, limit);
  return reply.send({
    success: true,
    data: results,
  });
}
