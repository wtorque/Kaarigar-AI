import { FastifyInstance } from 'fastify';
import {
  createCatalogueJobHandler,
  getCatalogueJobStatusHandler,
  publishCatalogueJobDraftHandler,
} from './catalogue.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles, requireVerifiedArtisan } from '../../middleware/rbac.middleware.js';
import { UserRole } from '@prisma/client';

export async function catalogueRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // Artisans can submit draft images for AI cataloguing
  fastify.post(
    '/ai/catalogue',
    {
      preHandler: [authorizeRoles(UserRole.ARTISAN, UserRole.ADMIN, UserRole.SUPER_ADMIN)],
    },
    createCatalogueJobHandler
  );

  fastify.get('/ai/catalogue/:jobId', getCatalogueJobStatusHandler);

  // Publishing draft into live product requires verified artisan status
  fastify.post(
    '/ai/catalogue/:jobId/publish',
    {
      preHandler: [
        authorizeRoles(UserRole.ARTISAN, UserRole.ADMIN, UserRole.SUPER_ADMIN),
        requireVerifiedArtisan,
      ],
    },
    publishCatalogueJobDraftHandler
  );
}
