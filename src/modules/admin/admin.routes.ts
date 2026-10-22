import { FastifyInstance } from 'fastify';
import { getAdminAnalyticsHandler, getAdminAuditLogsHandler } from './admin.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/rbac.middleware.js';
import { UserRole } from '@prisma/client';

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN));

  fastify.get('/admin/analytics', getAdminAnalyticsHandler);
  fastify.get('/admin/audit-logs', getAdminAuditLogsHandler);
}
