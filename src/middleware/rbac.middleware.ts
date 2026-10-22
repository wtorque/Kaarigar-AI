import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole, ArtisanStatus } from '@prisma/client';

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user;
    if (!user) {
      reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required for this resource',
        },
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Forbidden. Requires one of roles: [${allowedRoles.join(', ')}]`,
        },
      });
      return;
    }
  };
}

export async function requireVerifiedArtisan(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const user = request.user;
  if (!user) {
    reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
    return;
  }

  // Admins are exempt
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return;
  }

  if (user.role !== 'ARTISAN' || !user.artisanProfile) {
    reply.status(403).send({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'You must register an Artisan Profile before performing this action.',
      },
    });
    return;
  }

  if (user.artisanProfile.status !== ArtisanStatus.VERIFIED) {
    reply.status(403).send({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: `Artisan verification required. Current status: ${user.artisanProfile.status}. Only verified artisans can publish products or catalogue listings.`,
      },
    });
    return;
  }
}
