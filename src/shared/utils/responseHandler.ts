/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

export interface IResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T | null;
  meta?: Record<string, any>;
  error?: string | null;
}

const sendResponse = <T>(
  res: Response,
  {
    status,
    success,
    message,
    data = null,
    meta = {},
    error = null,
  }: IResponse<T>
): Response => {
  const response: IResponse<T> = {
    status,
    success,
    message,
    data,
    ...(Object.keys(meta).length > 0 && { meta }),
    error,
  };

  return res.status(status).json(response);
};

const successResponse = <T>(
  res: Response,
  data: T,
  message = "Operation successful",
  meta?: Record<string, any>
): Response =>
  sendResponse<T>(res, {
    status: 200,
    success: true,
    message,
    data,
    meta,
  });

const errorResponse = (
  res: Response,
  message = "An error occurred",
  error: string,
  status = 500
): Response =>
  sendResponse(res, {
    status,
    success: false,
    message,
    data: null,
    error,
  });

export { sendResponse, successResponse, errorResponse };
