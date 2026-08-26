import mongoose from 'mongoose';
import { ENV } from './env';
import { logger } from './logger';

export const connectDB = async (): Promise<void> => {
  if (!ENV.MONGODB_URI) {
    logger.warn('MONGODB_URI is not set in environment. Skipping database connection for now.');
    return;
  }

  const tryConnect = async () => {
    try {
      const conn = await mongoose.connect(ENV.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      logger.error(`MongoDB Connection Error: ${(error as Error).message}`);
      logger.info('Retrying MongoDB connection in 5 seconds...');
      setTimeout(tryConnect, 5000);
    }
  };

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Retrying connection...');
  });

  await tryConnect();
};
