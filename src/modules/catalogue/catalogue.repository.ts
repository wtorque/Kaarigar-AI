import { prisma } from '../../infrastructure/postgres/client.js';
import { CatalogueJobStatus } from '@prisma/client';
import { AICatalogueDraft } from '../../infrastructure/ai/gemini.js';

export class CatalogueRepository {
  async createJob(artisanId: string, imageUrl: string, artisanNotes?: string) {
    return prisma.catalogueJob.create({
      data: {
        artisanId,
        imageUrl,
        artisanNotes,
        status: CatalogueJobStatus.PENDING,
      },
    });
  }

  async findById(id: string) {
    return prisma.catalogueJob.findUnique({
      where: { id },
      include: {
        artisan: {
          select: { id: true, userId: true, businessName: true },
        },
      },
    });
  }

  async updateJobStarted(id: string) {
    return prisma.catalogueJob.update({
      where: { id },
      data: {
        status: CatalogueJobStatus.PROCESSING,
        startedAt: new Date(),
      },
    });
  }

  async updateJobCompleted(id: string, draft: AICatalogueDraft) {
    return prisma.catalogueJob.update({
      where: { id },
      data: {
        status: CatalogueJobStatus.COMPLETED,
        generatedDraft: draft as unknown as object,
        completedAt: new Date(),
      },
    });
  }

  async updateJobFailed(id: string, errorMessage: string) {
    return prisma.catalogueJob.update({
      where: { id },
      data: {
        status: CatalogueJobStatus.FAILED,
        errorMessage,
        completedAt: new Date(),
      },
    });
  }
}

export const catalogueRepository = new CatalogueRepository();
