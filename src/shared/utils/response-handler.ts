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

export { sendResponse };
