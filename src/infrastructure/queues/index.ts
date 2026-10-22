import { Queue, QueueOptions } from 'bullmq';
import { getRedisClient, isRedisConnected } from '../redis/client.js';
import { QUEUE_NAMES } from '../../config/constants.js';
import { logger } from '../../config/logger.js';

const defaultQueueOptions: QueueOptions = {
  connection: getRedisClient() as unknown as QueueOptions['connection'],
  prefix: '{kaarigar}',
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // keep for 24h
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // keep failures for 7 days
    },
  },
};

export const catalogueQueue = new Queue(QUEUE_NAMES.CATALOGUE_PROCESSING, defaultQueueOptions);
export const imageQueue = new Queue(QUEUE_NAMES.IMAGE_PROCESSING, defaultQueueOptions);
export const notificationQueue = new Queue(QUEUE_NAMES.NOTIFICATIONS, defaultQueueOptions);
export const inventoryCleanupQueue = new Queue(QUEUE_NAMES.INVENTORY_CLEANUP, defaultQueueOptions);

export interface CatalogueJobPayload {
  jobId: string;
  artisanId: string;
  imageUrl: string;
  artisanNotes?: string;
}

export async function enqueueCatalogueJob(payload: CatalogueJobPayload): Promise<void> {
  if (!isRedisConnected()) {
    logger.warn({ jobId: payload.jobId }, 'Redis not connected — job will be processed synchronously or queued upon reconnection');
  }

  try {
    await catalogueQueue.add('process-vision-draft', payload, {
      jobId: payload.jobId, // Idempotent job key
    });
    logger.info({ jobId: payload.jobId }, 'Catalogue job enqueued into BullMQ');
  } catch (err: unknown) {
    logger.error({ error: err instanceof Error ? err.message : String(err) }, 'Failed to enqueue BullMQ catalogue job');
  }
}

export async function closeQueues(): Promise<void> {
  await Promise.allSettled([
    catalogueQueue.close(),
    imageQueue.close(),
    notificationQueue.close(),
    inventoryCleanupQueue.close(),
  ]);
  logger.info('BullMQ queues closed.');
}
