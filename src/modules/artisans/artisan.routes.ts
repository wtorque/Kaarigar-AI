import { FastifyInstance } from 'fastify';
import {
  submitOnboardingHandler,
  getMyArtisanProfileHandler,
  getPublicArtisanProfileHandler,
  listArtisanApplicationsHandler,
  verifyArtisanHandler,
} from './artisan.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/rbac.middleware.js';
import { UserRole } from '@prisma/client';

export async function artisanRoutes(fastify: FastifyInstance) {
  // Public artisan profile
  fastify.get('/artisans/profile/:id', getPublicArtisanProfileHandler);

  // Authenticated artisan endpoints
  fastify.post(
    '/artisans/onboarding',
    { preHandler: [authenticate] },
    submitOnboardingHandler
  );

  fastify.get(
    '/artisans/me',
    { preHandler: [authenticate] },
    getMyArtisanProfileHandler
  );

  // Admin routes for reviewing & verifying artisans
  fastify.get(
    '/admin/artisans',
    { preHandler: [authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)] },
    listArtisanApplicationsHandler
  );

  fastify.patch(
    '/admin/artisans/:id/verify',
    { preHandler: [authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)] },
    verifyArtisanHandler
  );
}
