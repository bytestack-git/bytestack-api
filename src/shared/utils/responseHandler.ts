/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

interface ApiResponse {
  success: boolean;
  data?: any;
  message: string;
  error?: string | null;
  statusCode?: number;
}

const sendResponse = (
  res: Response,
  { success, data, message, error, statusCode = success ? 200 : 500 }: ApiResponse
): Response => {
  return res.status(statusCode).json({
    success,
    data,
    message,
    error,
  });
};

const successResponse = (res: Response, data: any, message = "operation successful"): Response =>
  sendResponse(res, { success: true, data, message });

const errorResponse = (
  res: Response,
  error: string,
  message = "An error occurred",
  statusCode = 500
): Response => sendResponse(res, { success: false, error, message, statusCode });

export { sendResponse, successResponse, errorResponse };