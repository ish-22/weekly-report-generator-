import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.util';
import { ApiResponse } from '../utils/api-response.util';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Handle Prisma Known Request Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      const target = prismaErr.meta?.target ? ` (${prismaErr.meta.target})` : '';
      return ApiResponse.error(res, `A record with this value already exists${target}.`, 409);
    }
    if (prismaErr.code === 'P2025') {
      return ApiResponse.error(res, 'Record to update/delete not found.', 404);
    }
  }

  console.error('[Unhandled Error]:', err);

  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred'
      : err.message || 'Internal server error';

  return ApiResponse.error(res, message, 500);
};
