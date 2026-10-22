import Fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import sensible from '@fastify/sensible';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import { errorHandler } from './plugins/error-handler.js';
import { registerSwagger } from './plugins/swagger.js';
import { v1Routes } from './routes/v1/index.js';
import { initFirebaseAdmin } from './infrastructure/firebase/admin.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function buildApp(): Promise<FastifyInstance<any, any, any, any, any>> {
  const fastify = Fastify({
    loggerInstance: logger,
    bodyLimit: 10 * 1024 * 1024, // 10MB limit for craft image uploads
  });

  // 1. Initialize Firebase Admin SDK
  initFirebaseAdmin();

  // 2. Global Security Plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: env.NODE_ENV === 'production',
  });

  await fastify.register(cors, {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'x-request-id', 'x-razorpay-signature', 'stripe-signature'],
  });

  // 3. Rate Limiting (Sliding Window)
  await fastify.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW_MS,
    keyGenerator: (req) => {
      // Rate limit per authenticated user ID if logged in, else by IP address
      return req.user?.id || req.ip;
    },
  });

  // 4. Multipart Support for Craft Image Uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5,
    },
  });

  await fastify.register(sensible);

  // 5. OpenAPI Swagger Documentation
  await registerSwagger(fastify);

  // 6. Global Error & 404 Handlers
  fastify.setErrorHandler(errorHandler);

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method} ${request.url} not found on Kaarigar AI server`,
      },
    });
  });

  // 7. Register API Version 1 Routes
  await fastify.register(v1Routes, { prefix: '/api/v1' });

  // Root welcome route
  fastify.get('/', async (_req, reply) => {
    return reply.send({
      name: 'Kaarigar AI REST API',
      version: '1.0.0',
      documentation: '/docs',
      health: '/api/v1/health',
    });
  });

  return fastify;
}
