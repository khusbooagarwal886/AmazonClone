import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If the status code was not previously set to an error code, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: ENV.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
