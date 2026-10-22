import { FastifyInstance } from 'fastify';
import {
  listCategoriesHandler,
  getCategoryBySlugHandler,
  createCategoryHandler,
  updateCategoryHandler,
} from './category.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/rbac.middleware.js';
import { UserRole } from '@prisma/client';

export async function categoryRoutes(fastify: FastifyInstance) {
  // Public category routes
  fastify.get('/categories', listCategoriesHandler);
  fastify.get('/categories/:slug', getCategoryBySlugHandler);

  // Admin protected category routes
  fastify.post(
    '/categories',
    {
      preHandler: [authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)],
    },
    createCategoryHandler
  );

  fastify.patch(
    '/categories/:id',
    {
      preHandler: [authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)],
    },
    updateCategoryHandler
  );
}
