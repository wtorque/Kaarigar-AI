import { FastifyRequest, FastifyReply } from 'fastify';
import { productService } from './product.service.js';
import {
  queryProductsSchema,
  createProductSchema,
  updateProductSchema,
} from './product.schema.js';

export async function listProductsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = queryProductsSchema.safeParse(request.query);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid product query filters',
        details: parsed.error.issues,
      },
    });
  }

  const result = await productService.listPublicProducts(parsed.data);
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

export async function getProductByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  try {
    const product = await productService.getProductById(id);
    return reply.send({
      success: true,
      data: product,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Product not found';
    return reply.status(404).send({
      success: false,
      error: { code: 'NOT_FOUND', message },
    });
  }
}

export async function createProductHandler(request: FastifyRequest, reply: FastifyReply) {
  const parsed = createProductSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid product payload',
        details: parsed.error.issues,
      },
    });
  }

  try {
    const product = await productService.createProduct(request.user!, parsed.data);
    return reply.status(201).send({
      success: true,
      data: product,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product';
    const status = message.includes('FORBIDDEN') ? 403 : 500;
    return reply.status(status).send({
      success: false,
      error: {
        code: message.includes('FORBIDDEN') ? 'FORBIDDEN' : 'INTERNAL_SERVER_ERROR',
        message,
      },
    });
  }
}

export async function updateProductHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const parsed = updateProductSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid product update payload',
        details: parsed.error.issues,
      },
    });
  }

  try {
    const updated = await productService.updateProduct(id, request.user!, parsed.data);
    return reply.send({
      success: true,
      data: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed';
    const status = message.includes('FORBIDDEN') ? 403 : message.includes('NOT_FOUND') ? 404 : 500;
    return reply.status(status).send({
      success: false,
      error: {
        code: message.includes('FORBIDDEN') ? 'FORBIDDEN' : message.includes('NOT_FOUND') ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
        message,
      },
    });
  }
}

export async function deleteProductHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  try {
    await productService.deleteProduct(id, request.user!);
    return reply.send({
      success: true,
      data: { message: 'Product deleted successfully' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Deletion failed';
    const status = message.includes('FORBIDDEN') ? 403 : message.includes('NOT_FOUND') ? 404 : 500;
    return reply.status(status).send({
      success: false,
      error: {
        code: message.includes('FORBIDDEN') ? 'FORBIDDEN' : 'NOT_FOUND',
        message,
      },
    });
  }
}
