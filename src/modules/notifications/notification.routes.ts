import { FastifyInstance } from 'fastify';
import {
  listNotificationsHandler,
  markNotificationReadHandler,
  markAllNotificationsReadHandler,
} from './notification.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export async function notificationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/notifications', listNotificationsHandler);
  fastify.patch('/notifications/:id/read', markNotificationReadHandler);
  fastify.post('/notifications/read-all', markAllNotificationsReadHandler);
}
