import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const requestId = (request.headers['x-request-id'] || request.id) as string;

  // Log error with context
  logger.error(
    {
      requestId,
      method: request.method,
      url: request.url,
      statusCode: error.statusCode || 500,
      errorName: error.name,
      errorMessage: error.message,
      stack: env.NODE_ENV !== 'production' ? error.stack : undefined,
    },
    'Request error encountered'
  );

  // 1. Zod Validation Errors
  if (error.name === 'ZodError' || error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.validation || (error as unknown as { issues: unknown }).issues,
        requestId,
      },
    });
  }

  // 2. Fastify Rate Limit Exceeded
  if (error.statusCode === 429) {
    return reply.status(429).send({
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: 'Rate limit exceeded. Please try again later.',
        requestId,
      },
    });
  }

  // 3. Known HTTP status codes
  const statusCode = error.statusCode || 500;
  let code = 'INTERNAL_SERVER_ERROR';

  if (statusCode === 400) code = 'BAD_REQUEST';
  else if (statusCode === 401) code = 'UNAUTHORIZED';
  else if (statusCode === 403) code = 'FORBIDDEN';
  else if (statusCode === 404) code = 'NOT_FOUND';
  else if (statusCode === 409) code = 'CONFLICT';

  // In production, never leak 500 internal server error details
  const message =
    statusCode === 500 && env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please contact Kaarigar AI support.'
      : error.message;

  return reply.status(statusCode).send({
    success: false,
    error: {
      code,
      message,
      requestId,
    },
  });
}
