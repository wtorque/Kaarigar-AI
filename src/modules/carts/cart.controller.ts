import { FastifyRequest, FastifyReply } from 'fastify';
import { cartService } from './cart.service.js';
import { addCartItemSchema, updateCartItemSchema } from './cart.schema.js';

export async function getCartHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const cart = await cartService.getCart(userId);
  return reply.send({
    success: true,
    data: cart,
  });
}

export async function addCartItemHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const parsed = addCartItemSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid cart item payload',
        details: parsed.error.issues,
      },
    });
  }

  try {
    const updatedCart = await cartService.addItem(userId, parsed.data);
    return reply.status(201).send({
      success: true,
      data: updatedCart,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add item to cart';
    const status = message.includes('CONFLICT') ? 409 : message.includes('NOT_FOUND') ? 404 : 500;
    return reply.status(status).send({
      success: false,
      error: { code: message.includes('CONFLICT') ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR', message },
    });
  }
}

export async function updateCartItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.id;
  const { id } = request.params as { id: string };
  const parsed = updateCartItemSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid update payload',
        details: parsed.error.issues,
      },
    });
  }

  const updatedCart = await cartService.updateItem(userId, id, parsed.data);
  return reply.send({
    success: true,
    data: updatedCart,
  });
}

export async function removeCartItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.id;
  const { id } = request.params as { id: string };
  const updatedCart = await cartService.removeItem(userId, id);
  return reply.send({
    success: true,
    data: updatedCart,
  });
}
