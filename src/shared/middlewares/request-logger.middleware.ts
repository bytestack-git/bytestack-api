import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log the request when the response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const contentLength = res.get("content-length") || 0;

    logger.info("HTTP Request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      contentLength,
      responseTime: `${duration} ms`,
      body: req.body,
    });
  });

  next();
};