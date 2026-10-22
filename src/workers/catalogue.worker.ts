import { Worker, Job } from 'bullmq';
import { getRedisClient } from '../infrastructure/redis/client.js';
import { QUEUE_NAMES } from '../config/constants.js';
import { CatalogueJobPayload } from '../infrastructure/queues/index.js';
import { catalogueRepository } from '../modules/catalogue/catalogue.repository.js';
import { visionAIProvider } from '../infrastructure/ai/gemini.js';
import { logger } from '../config/logger.js';
import { prisma } from '../infrastructure/postgres/client.js';

export function createCatalogueWorker(): Worker {
  const worker = new Worker(
    QUEUE_NAMES.CATALOGUE_PROCESSING,
    async (job: Job<CatalogueJobPayload>) => {
      const { jobId, artisanId, imageUrl, artisanNotes } = job.data;
      logger.info({ jobId, artisanId }, 'Processing AI catalogue vision job');

      try {
        await catalogueRepository.updateJobStarted(jobId);

        // Call Vision AI provider
        const draft = await visionAIProvider.analyzeCraftImage(imageUrl, artisanNotes);

        // Store completed draft in PostgreSQL
        await catalogueRepository.updateJobCompleted(jobId, draft);

        // Create in-app notification for artisan
        const artisan = await prisma.artisanProfile.findUnique({
          where: { id: artisanId },
          select: { userId: true },
        });

        if (artisan) {
          await prisma.notification.create({
            data: {
              userId: artisan.userId,
              type: 'CATALOGUE_READY',
              title: 'AI Craft Listing Ready for Review',
              message: `Draft generated for: "${draft.suggestedTitle}". Review and publish to your shop.`,
              linkUrl: `/artisans/drafts/${jobId}`,
            },
          });
        }

        logger.info({ jobId }, 'AI catalogue job completed successfully');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logger.error({ jobId, error: errorMsg }, 'AI catalogue job failed');
        await catalogueRepository.updateJobFailed(jobId, errorMsg);
        throw err; // Trigger BullMQ retry strategy
      }
    },
    {
      connection: getRedisClient() as unknown as Worker['opts']['connection'],
      concurrency: 5,
    }
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, 'BullMQ job permanently failed');
  });

  return worker;
}
