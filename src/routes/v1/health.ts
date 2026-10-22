import { FastifyInstance } from 'fastify';
import { checkPostgresHealth } from '../../infrastructure/postgres/client.js';
import { checkRedisHealth } from '../../infrastructure/redis/client.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_req, reply) => {
    return reply.send({
      success: true,
      data: {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
      },
    });
  });

  fastify.get('/health/ready', async (_req, reply) => {
    const [pgCheck, redisCheck] = await Promise.all([
      checkPostgresHealth(),
      checkRedisHealth(),
    ]);

    const isReady = pgCheck.status === 'UP'; // Redis degradation allowed in dev/test, PostgreSQL is required

    const statusCode = isReady ? 200 : 503;
    return reply.status(statusCode).send({
      success: isReady,
      data: {
        status: isReady ? 'READY' : 'NOT_READY',
        checks: {
          database: pgCheck,
          redis: redisCheck,
        },
      },
    });
  });
}
