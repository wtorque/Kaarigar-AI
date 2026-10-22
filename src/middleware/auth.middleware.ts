import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyFirebaseIdToken } from '../infrastructure/firebase/admin.js';
import { userService } from '../modules/users/user.service.js';
import { logger } from '../config/logger.js';
import { AuthenticatedUser } from '../types/fastify.js';

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.status(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid Authorization header. Expected Bearer <token>',
      },
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    reply.status(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Empty Bearer token provided',
      },
    });
    return;
  }

  try {
    const verifiedToken = await verifyFirebaseIdToken(token);
    const user = await userService.authenticateFirebaseToken(verifiedToken);

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      name: user.name,
      avatarUrl: user.avatarUrl,
      artisanProfile: (user as { artisanProfile?: AuthenticatedUser['artisanProfile'] }).artisanProfile,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid authentication token';
    logger.warn({ error: message, ip: request.ip }, 'Authentication failed');

    if (message.includes('USER_SUSPENDED')) {
      reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Your account is suspended',
        },
      });
      return;
    }

    reply.status(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed. Token is invalid, expired or revoked.',
      },
    });
  }
}

export async function optionalAuthenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!token) return;

  try {
    const verifiedToken = await verifyFirebaseIdToken(token);
    const user = await userService.authenticateFirebaseToken(verifiedToken);
    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      name: user.name,
      avatarUrl: user.avatarUrl,
      artisanProfile: (user as { artisanProfile?: AuthenticatedUser['artisanProfile'] }).artisanProfile,
    };
  } catch {
    // Ignore invalid optional tokens
  }
}
