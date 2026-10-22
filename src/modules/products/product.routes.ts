import { FastifyInstance } from 'fastify';
import {
  listProductsHandler,
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from './product.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles, requireVerifiedArtisan } from '../../middleware/rbac.middleware.js';
import { UserRole } from '@prisma/client';

export async function productRoutes(fastify: FastifyInstance) {
  // Public product browsing
  fastify.get('/products', listProductsHandler);
  fastify.get('/products/:id', getProductByIdHandler);

  // Artisan product creation (strictly requires authenticated artisan, verified to publish)
  fastify.post(
    '/artisans/products',
    {
      preHandler: [authenticate, authorizeRoles(UserRole.ARTISAN, UserRole.ADMIN, UserRole.SUPER_ADMIN), requireVerifiedArtisan],
    },
    createProductHandler
  );

  fastify.patch(
    '/artisans/products/:id',
    {
      preHandler: [authenticate, authorizeRoles(UserRole.ARTISAN, UserRole.ADMIN, UserRole.SUPER_ADMIN)],
    },
    updateProductHandler
  );

  fastify.delete(
    '/artisans/products/:id',
    {
      preHandler: [authenticate, authorizeRoles(UserRole.ARTISAN, UserRole.ADMIN, UserRole.SUPER_ADMIN)],
    },
    deleteProductHandler
  );
}
