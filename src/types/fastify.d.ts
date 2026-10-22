import { UserRole, UserStatus, ArtisanProfile } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  name?: string | null;
  avatarUrl?: string | null;
  artisanProfile?: ArtisanProfile | null;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
    idempotencyKey?: string;
  }
}
