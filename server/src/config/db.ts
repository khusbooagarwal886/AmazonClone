import mongoose from 'mongoose';
import { ENV } from './env';
import { logger } from './logger';

export const connectDB = async (): Promise<void> => {
  try {
    if (!ENV.MONGODB_URI) {
      logger.warn('MONGODB_URI is not set in .env. Skipping database connection for now.');
      return;
    }

    const conn = await mongoose.connect(ENV.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${(error as Error).message}`);
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
