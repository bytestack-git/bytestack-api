import { NextFunction, Request, Response } from "express";

export interface IFileUploadController {
  getUploadURL(req: Request, res: Response, next: NextFunction): Promise<void>;
}
