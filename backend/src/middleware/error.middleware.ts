import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Operational errors (expected)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Unexpected errors — log server-side, hide details from client
  logger.error({ message: err.message, stack: err.stack }, 'Unhandled error');

  return res.status(500).json({
    error: 'An unexpected error occurred. Please try again.',
  });
}
