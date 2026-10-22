import { catalogueRepository, CatalogueRepository } from './catalogue.repository.js';
import { CreateCatalogueJobInput, PublishCatalogueJobInput } from './catalogue.schema.js';
import { enqueueCatalogueJob } from '../../infrastructure/queues/index.js';
import { productService } from '../products/product.service.js';
import { AuthenticatedUser } from '../../types/fastify.js';

export class CatalogueService {
  constructor(private catRepo: CatalogueRepository = catalogueRepository) {}

  async initiateJob(artisanId: string, input: CreateCatalogueJobInput) {
    const job = await this.catRepo.createJob(artisanId, input.imageUrl, input.artisanNotes);

    // Enqueue asynchronously to BullMQ
    await enqueueCatalogueJob({
      jobId: job.id,
      artisanId,
      imageUrl: input.imageUrl,
      artisanNotes: input.artisanNotes,
    });

    return {
      jobId: job.id,
      status: job.status,
      estimatedDurationSeconds: 5,
      checkStatusUrl: `/api/v1/ai/catalogue/${job.id}`,
    };
  }

  async getJobStatus(jobId: string, artisanId: string, isAdmin = false) {
    const job = await this.catRepo.findById(jobId);
    if (!job) {
      throw new Error('NOT_FOUND: Catalogue job not found');
    }

    if (job.artisanId !== artisanId && !isAdmin) {
      throw new Error('FORBIDDEN: You do not have permission to view this catalogue job');
    }

    return job;
  }

  async publishDraft(jobId: string, user: AuthenticatedUser, input: PublishCatalogueJobInput) {
    const job = await this.getJobStatus(jobId, user.artisanProfile!.id, user.role === 'ADMIN');
    if (job.status !== 'COMPLETED') {
      throw new Error('CONFLICT: Cannot publish a draft that has not completed processing');
    }

    // Publish to live product catalogue
    const product = await productService.createProduct(user, input);
    return product;
  }
}

export const catalogueService = new CatalogueService();
