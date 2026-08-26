import { createClient, RedisClientType } from 'redis';
import { ENV } from './env';
import { logger } from './logger';

let redisClient: RedisClientType | null = null;

if (ENV.REDIS_URL) {
  redisClient = createClient({
    url: ENV.REDIS_URL,
  });

  redisClient.on('error', (err) => {
    logger.error(`Redis Client Error: ${err.message}`);
  });

  redisClient.on('reconnecting', () => {
    logger.warn('Redis client reconnecting...');
  });
}

export const connectRedis = async (): Promise<void> => {
  if (!ENV.REDIS_URL || !redisClient) {
    logger.warn('REDIS_URL is not set in .env. Redis caching will be disabled.');
    return;
  }

  try {
    await redisClient.connect();
    logger.info('Redis Connected successfully');
  } catch (error) {
    logger.error(`Redis Connection Error: ${(error as Error).message}`);
  }
};

export { redisClient };
