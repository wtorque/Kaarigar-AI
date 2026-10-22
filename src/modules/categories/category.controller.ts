import { FastifyRequest, FastifyReply } from 'fastify';
import { categoryService } from './category.service.js';
import { createCategorySchema, updateCategorySchema } from './category.schema.js';

export async function listCategoriesHandler(_request: FastifyRequest, reply: FastifyReply) {
  const categories = await categoryService.listCategories();
  return reply.send({
    success: true,
    data: categories,
  });
}

export async function getCategoryBySlugHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { slug } = request.params as { slug: string };
  try {
    const category = await categoryService.getCategoryBySlug(slug);
    return reply.send({
      success: true,
      data: category,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Category not found';
    return reply.status(404).send({
      success: false,
      error: { code: 'NOT_FOUND', message },
    });
  }
}

export async function createCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
  const parsed = createCategorySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid category payload',
        details: parsed.error.issues,
      },
    });
  }

  try {
    const created = await categoryService.createCategory(parsed.data);
    return reply.status(201).send({
      success: true,
      data: created,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create category';
    const status = message.includes('CONFLICT') ? 409 : 500;
    return reply.status(status).send({
      success: false,
      error: {
        code: message.includes('CONFLICT') ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
        message,
      },
    });
  }
}

export async function updateCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const parsed = updateCategorySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid category update payload',
        details: parsed.error.issues,
      },
    });
  }

  const updated = await categoryService.updateCategory(id, parsed.data);
  return reply.send({
    success: true,
    data: updated,
  });
}
