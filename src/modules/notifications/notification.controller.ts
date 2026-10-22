import { FastifyRequest, FastifyReply } from 'fastify';
import { notificationService } from './notification.service.js';

export async function listNotificationsHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const notifications = await notificationService.listUserNotifications(userId);
  return reply.send({
    success: true,
    data: notifications,
  });
}

export async function markNotificationReadHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const userId = request.user!.id;
  await notificationService.markAsRead(request.params.id, userId);
  return reply.send({
    success: true,
    data: { message: 'Notification marked as read' },
  });
}

export async function markAllNotificationsReadHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  await notificationService.markAllAsRead(userId);
  return reply.send({
    success: true,
    data: { message: 'All notifications marked as read' },
  });
}
