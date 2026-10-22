import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file if available
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGIN: z.string().default('*'),

  // PostgreSQL (Primary database)
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),

  // Redis (Cache & Queues)
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_KEY_PREFIX: z.string().default('kaarigar:'),

  // Firebase Authentication
  FIREBASE_PROJECT_ID: z.string().optional().default('kaarigar-ai-dev'),
  FIREBASE_CLIENT_EMAIL: z.string().optional().default('firebase-adminsdk@kaarigar-ai-dev.iam.gserviceaccount.com'),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  ALLOW_DEV_AUTH_BYPASS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),

  // Vision AI
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),

  // Object Storage
  STORAGE_PROVIDER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  STORAGE_LOCAL_DIR: z.string().default('./uploads'),
  STORAGE_S3_BUCKET: z.string().optional().default('kaarigar-assets'),
  STORAGE_S3_REGION: z.string().optional().default('ap-south-1'),
  STORAGE_S3_ENDPOINT: z.string().optional(),
  STORAGE_S3_ACCESS_KEY_ID: z.string().optional(),
  STORAGE_S3_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Payment Provider
  PAYMENT_PROVIDER: z.enum(['sandbox', 'razorpay', 'stripe']).default('sandbox'),
  PAYMENT_KEY_ID: z.string().optional().default('rzp_test_sample'),
  PAYMENT_KEY_SECRET: z.string().optional().default('sample_secret'),
  PAYMENT_WEBHOOK_SECRET: z.string().optional().default('sample_webhook_secret'),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_TIME_WINDOW_MS: z.coerce.number().default(60000),

  // Monitoring
  SENTRY_DSN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables configuration:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    // In test environment, provide fallback to avoid blocking
    if (process.env.NODE_ENV === 'test') {
      return envSchema.parse({
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/kaarigar_test?schema=public',
      });
    }
    process.exit(1);
  }
  return result.data;
}

export const env = validateEnv();
