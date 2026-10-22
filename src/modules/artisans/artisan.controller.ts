import { FastifyRequest, FastifyReply } from 'fastify';
import { artisanService } from './artisan.service.js';
import { artisanOnboardingSchema, verifyArtisanSchema } from './artisan.schema.js';
import { ArtisanStatus } from '@prisma/client';

export async function submitOnboardingHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  const parsed = artisanOnboardingSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid artisan onboarding details',
        details: parsed.error.issues,
      },
    });
  }

  try {
    const profile = await artisanService.submitOnboarding(userId, parsed.data);
    return reply.status(201).send({
      success: true,
      data: profile,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Onboarding submission failed';
    const status = message.includes('CONFLICT') ? 409 : 500;
    return reply.status(status).send({
      success: false,
      error: { code: message.includes('CONFLICT') ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR', message },
    });
  }
}

export async function getMyArtisanProfileHandler(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user!.id;
  try {
    const profile = await artisanService.getMyProfile(userId);
    return reply.send({
      success: true,
      data: profile,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Not found';
    return reply.status(404).send({
      success: false,
      error: { code: 'NOT_FOUND', message },
    });
  }
}

export async function getPublicArtisanProfileHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  try {
    const profile = await artisanService.getPublicProfile(id);
    return reply.send({
      success: true,
      data: profile,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Not found';
    return reply.status(404).send({
      success: false,
      error: { code: 'NOT_FOUND', message },
    });
  }
}

export async function listArtisanApplicationsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { status } = request.query as { status?: ArtisanStatus };
  const applications = await artisanService.listApplications(status);
  return reply.send({
    success: true,
    data: applications,
  });
}

export async function verifyArtisanHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const adminUserId = request.user!.id;
  const { id: artisanId } = request.params as { id: string };

  const parsed = verifyArtisanSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid verification payload',
        details: parsed.error.issues,
      },
    });
  }

  const updated = await artisanService.verifyArtisan(artisanId, adminUserId, parsed.data);
  return reply.send({
    success: true,
    data: updated,
  });
}
