import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { disconnectPostgres } from './infrastructure/postgres/client.js';
import { disconnectRedis } from './infrastructure/redis/client.js';

async function startServer() {
  try {
    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`✨ Kaarigar AI REST API running at http://${env.HOST}:${env.PORT}`);
    logger.info(`📚 Swagger UI documentation available at http://${env.HOST}:${env.PORT}/docs`);

    // Graceful Shutdown handling
    const shutdown = async (signal: string) => {
      logger.info({ signal }, 'Gracefully shutting down Kaarigar AI API server...');

      try {
        await app.close();
        await Promise.allSettled([disconnectPostgres(), disconnectRedis()]);
        logger.info('Clean shutdown completed.');
        process.exit(0);
      } catch (err: unknown) {
        logger.error({ error: err instanceof Error ? err.message : String(err) }, 'Error during shutdown');
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err: unknown) {
    logger.fatal({ error: err instanceof Error ? err.message : String(err) }, 'Failed to start API server');
    process.exit(1);
  }
}

startServer();
