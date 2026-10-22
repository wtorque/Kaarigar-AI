import { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from './order.service.js';
import { createCheckoutOrderSchema, queryOrdersSchema } from './order.schema.js';

export async function createOrderHandler(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user!;
  const parsed = createCheckoutOrderSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid order creation parameters',
        details: parsed.error.issues,
      },
    });
  }

  const idempotencyKey = request.headers['idempotency-key'] as string | undefined;
  try {
    const result = await orderService.createCheckoutOrder(user, parsed.data, idempotencyKey);
    return reply.status(201).send({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Order creation failed';
    const status = message.includes('CONFLICT') ? 409 : 500;
    return reply.status(status).send({
      success: false,
      error: { code: message.includes('CONFLICT') ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR', message },
    });
  }
}

export async function listOrdersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.user!;
  const parsed = queryOrdersSchema.safeParse(request.query);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid query filters',
        details: parsed.error.issues,
      },
    });
  }

  const result = await orderService.listOrders(user, parsed.data);
  return reply.send({
    success: true,
    data: result.items,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  });
}

export async function getOrderByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.user!;
  const { id } = request.params as { id: string };
  try {
    const order = await orderService.getOrderById(id, user);
    return reply.send({
      success: true,
      data: order,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Order not found';
    const status = message.includes('FORBIDDEN') ? 403 : 404;
    return reply.status(status).send({
      success: false,
      error: { code: message.includes('FORBIDDEN') ? 'FORBIDDEN' : 'NOT_FOUND', message },
    });
  }
}

export async function cancelOrderHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = request.user!;
  const { id } = request.params as { id: string };
  try {
    const cancelled = await orderService.cancelOrder(id, user);
    return reply.send({
      success: true,
      data: cancelled,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cancellation failed';
    const status = message.includes('FORBIDDEN') ? 403 : message.includes('CONFLICT') ? 409 : 500;
    return reply.status(status).send({
      success: false,
      error: { code: message.includes('FORBIDDEN') ? 'FORBIDDEN' : 'INTERNAL_SERVER_ERROR', message },
    });
  }
}
