import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerSwagger(fastify: FastifyInstance<any, any, any, any, any>) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Kaarigar AI REST API',
        description: 'Enterprise REST API powering Indian artisans with AI-assisted cataloguing, commerce, and inventory.',
        version: '1.0.0',
        contact: {
          name: 'Kaarigar AI Engineering',
          email: 'engineering@kaarigar.ai',
        },
      },
      servers: [
        {
          url: 'http://localhost:4000',
          description: 'Local Development Server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your Firebase ID Token',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
}
