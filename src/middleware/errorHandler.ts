import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

interface CustomError extends Error {
  status?: number;
}

function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const statusCode = err.status || 500;
  logger.error(`Error: ${err.message}, Status Code: ${statusCode}`);

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
  });
}

export default errorHandler;
