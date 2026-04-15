import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  console.error(err);
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
}
