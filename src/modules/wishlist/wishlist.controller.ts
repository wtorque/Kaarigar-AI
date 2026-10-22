import { FastifyRequest, FastifyReply } from 'fastify';
import { wishlistService } from './wishlist.service.js';
import { z } from 'zod';

const addWishlistItemSchema = z.object({
  productId: z.string().uuid(),
});

export async function getWishlistHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const wishlist = await wishlistService.getOrCreateWishlist(userId);
  return reply.send({
    success: true,
    data: wishlist,
  });
}

export async function addWishlistItemHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const parsed = addWishlistItemSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid product ID',
        details: parsed.error.issues,
      },
    });
  }

  const wishlist = await wishlistService.addItem(userId, parsed.data.productId);
  return reply.status(201).send({
    success: true,
    data: wishlist,
  });
}

export async function removeWishlistItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.id;
  const { productId } = request.params as { productId: string };
  const wishlist = await wishlistService.removeItem(userId, productId);
  return reply.send({
    success: true,
    data: wishlist,
  });
}
