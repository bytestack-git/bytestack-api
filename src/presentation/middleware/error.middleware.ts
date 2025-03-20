import { Request, Response, NextFunction } from "express";
import { BaseError } from "../../domain/errors/base.error";
import { logger } from "../../shared/utils/logger";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(error instanceof BaseError) || !error.isOperational) {
    logger.error(error.message, {
      stack: error.stack,
      path: req.path,
      method: req.method,
      isOperational: error instanceof BaseError ? error.isOperational : false,
    });
  }

  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  });
};
