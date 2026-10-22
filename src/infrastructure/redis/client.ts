import { Redis } from 'ioredis';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

let redisInstance: Redis | null = null;
let isRedisAvailable = false;

export function getRedisClient(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
      db: env.REDIS_DB,
      maxRetriesPerRequest: null, // Required by BullMQ
      retryStrategy(times) {
        // Exponential backoff capped at 3 seconds
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      enableOfflineQueue: false, // Don't hang indefinitely if Redis is down
    });

    redisInstance.on('connect', () => {
      isRedisAvailable = true;
      logger.info('✅ Connected to Redis.');
    });

    redisInstance.on('ready', () => {
      isRedisAvailable = true;
    });

    redisInstance.on('error', (err: Error) => {
      isRedisAvailable = false;
      // Log as debug in development/test to prevent log spam if redis is not running locally
      if (env.NODE_ENV === 'production') {
        logger.error({ error: err.message }, 'Redis error');
      } else {
        logger.debug({ error: err.message }, 'Redis unavailable — graceful degradation active');
      }
    });

    redisInstance.on('close', () => {
      isRedisAvailable = false;
    });
  }

  return redisInstance;
}

export const redis = getRedisClient();

export function isRedisConnected(): boolean {
  return isRedisAvailable;
}

export async function checkRedisHealth(): Promise<{ status: 'UP' | 'DOWN'; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const client = getRedisClient();
    const pong = await client.ping();
    if (pong === 'PONG') {
      return { status: 'UP', latencyMs: Date.now() - start };
    }
    return { status: 'DOWN', error: 'Unexpected ping response' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: 'DOWN', error: message };
  }
}

/**
 * Cache helper with graceful degradation:
 * If Redis is offline, get returns null and set/del silently resolve.
 */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!isRedisAvailable) return null;
    try {
      const data = await redis.get(`${env.REDIS_KEY_PREFIX}${key}`);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    if (!isRedisAvailable) return;
    try {
      await redis.set(`${env.REDIS_KEY_PREFIX}${key}`, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      // Graceful degradation
    }
  },

  async del(key: string): Promise<void> {
    if (!isRedisAvailable) return;
    try {
      await redis.del(`${env.REDIS_KEY_PREFIX}${key}`);
    } catch {
      // Graceful degradation
    }
  },

  async invalidatePrefix(prefix: string): Promise<void> {
    if (!isRedisAvailable) return;
    try {
      const keys = await redis.keys(`${env.REDIS_KEY_PREFIX}${prefix}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {
      // Graceful degradation
    }
  },
};

export async function disconnectRedis(): Promise<void> {
  if (redisInstance) {
    try {
      await redisInstance.quit();
    } catch {
      redisInstance.disconnect();
    }
    redisInstance = null;
    isRedisAvailable = false;
  }
}
