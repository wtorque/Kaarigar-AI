import { FastifyRequest, FastifyReply } from 'fastify';
import { analyticsService } from '../analytics/analytics.service.js';
import { prisma } from '../../infrastructure/postgres/client.js';

export async function getAdminAnalyticsHandler(_request: FastifyRequest, reply: FastifyReply) {
  const data = await analyticsService.getPlatformOverview();
  return reply.send({
    success: true,
    data,
  });
}

export async function getAdminAuditLogsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = request.query as { page?: number; limit?: number; action?: string };
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const where = query.action ? { action: query.action } : {};

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return reply.send({
    success: true,
    data: logs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
