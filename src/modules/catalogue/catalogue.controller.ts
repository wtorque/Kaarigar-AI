import { FastifyRequest, FastifyReply } from 'fastify';
import { catalogueService } from './catalogue.service.js';
import { createCatalogueJobSchema, publishCatalogueJobSchema } from './catalogue.schema.js';
import { storage } from '../../infrastructure/storage/index.js';

export async function createCatalogueJobHandler(request: FastifyRequest, reply: FastifyReply) {
  const artisanProfile = request.user?.artisanProfile;
  if (!artisanProfile) {
    return reply.status(403).send({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Artisan profile required to initiate AI cataloguing' },
    });
  }

  // Handle multipart file upload or JSON payload
  let imageUrl: string | undefined;
  let artisanNotes: string | undefined;

  if (request.isMultipart()) {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'No file uploaded' },
      });
    }

    const buffer = await data.toBuffer();
    imageUrl = await storage.upload(buffer, data.filename, data.mimetype);
    // @ts-expect-error fields access in multipart
    artisanNotes = data.fields?.artisanNotes?.value;
  } else {
    const parsed = createCatalogueJobSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid catalogue job payload',
          details: parsed.error.issues,
        },
      });
    }
    imageUrl = parsed.data.imageUrl;
    artisanNotes = parsed.data.artisanNotes;
  }

  const result = await catalogueService.initiateJob(artisanProfile.id, {
    imageUrl,
    artisanNotes,
  });

  return reply.status(202).send({
    success: true,
    data: result,
  });
}

export async function getCatalogueJobStatusHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { jobId } = request.params as { jobId: string };
  const artisanProfile = request.user?.artisanProfile;
  const isAdmin = request.user?.role === 'ADMIN' || request.user?.role === 'SUPER_ADMIN';

  if (!artisanProfile && !isAdmin) {
    return reply.status(403).send({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Artisan profile required' },
    });
  }

  try {
    const job = await catalogueService.getJobStatus(
      jobId,
      artisanProfile?.id || '',
      isAdmin
    );
    return reply.send({
      success: true,
      data: job,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Not found';
    const status = message.includes('FORBIDDEN') ? 403 : 404;
    return reply.status(status).send({
      success: false,
      error: { code: message.includes('FORBIDDEN') ? 'FORBIDDEN' : 'NOT_FOUND', message },
    });
  }
}

export async function publishCatalogueJobDraftHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { jobId } = request.params as { jobId: string };
  const parsed = publishCatalogueJobSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid product listing payload from draft',
        details: parsed.error.issues,
      },
    });
  }

  try {
    const product = await catalogueService.publishDraft(jobId, request.user!, parsed.data);
    return reply.status(201).send({
      success: true,
      data: product,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Publish failed';
    const status = message.includes('FORBIDDEN') ? 403 : message.includes('CONFLICT') ? 409 : 500;
    return reply.status(status).send({
      success: false,
      error: { code: message.includes('FORBIDDEN') ? 'FORBIDDEN' : 'INTERNAL_SERVER_ERROR', message },
    });
  }
}
