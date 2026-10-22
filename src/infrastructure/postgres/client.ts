import { PrismaClient } from '@prisma/client';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log:
        env.NODE_ENV === 'development'
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'event', level: 'error' },
              { emit: 'event', level: 'info' },
              { emit: 'event', level: 'warn' },
            ]
          : [{ emit: 'event', level: 'error' }],
    });

    if (env.NODE_ENV === 'development') {
      // @ts-expect-error Prisma event typing
      prismaInstance.$on('query', (e: { query: string; params: string; duration: number }) => {
        logger.debug({ query: e.query, durationMs: e.duration }, 'Prisma Query');
      });
    }

    // @ts-expect-error Prisma event typing
    prismaInstance.$on('error', (e: { message: string }) => {
      logger.error({ error: e.message }, 'Prisma Database Error');
    });
  }

  return prismaInstance;
}

export const prisma = getPrismaClient();

export async function checkPostgresHealth(): Promise<{ status: 'UP' | 'DOWN'; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'UP',
      latencyMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ error: message }, 'PostgreSQL health check failed');
    return {
      status: 'DOWN',
      error: message,
    };
  }
}

export async function disconnectPostgres(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    logger.info('PostgreSQL connection closed.');
    prismaInstance = null;
  }
}
