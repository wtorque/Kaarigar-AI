import { createCatalogueWorker } from './catalogue.worker.js';
import { releaseExpiredReservations } from './cleanup.worker.js';
import { logger } from '../config/logger.js';
import { closeQueues } from '../infrastructure/queues/index.js';
import { disconnectRedis } from '../infrastructure/redis/client.js';
import { disconnectPostgres } from '../infrastructure/postgres/client.js';

logger.info('🚀 Starting Kaarigar AI background worker process...');

const catalogueWorker = createCatalogueWorker();

// Run reservation cleanup cron every 2 minutes
const cleanupInterval = setInterval(async () => {
  try {
    const released = await releaseExpiredReservations();
    if (released > 0) {
      logger.info({ released }, 'Expired reservation cleanup sweep completed');
    }
  } catch (err: unknown) {
    logger.error({ error: err instanceof Error ? err.message : String(err) }, 'Cleanup worker sweep error');
  }
}, 2 * 60 * 1000);

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down worker process gracefully...');
  clearInterval(cleanupInterval);

  await Promise.allSettled([
    catalogueWorker.close(),
    closeQueues(),
    disconnectRedis(),
    disconnectPostgres(),
  ]);

  logger.info('Worker process terminated cleanly.');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
