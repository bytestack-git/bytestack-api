import { NextFunction, Request, Response } from "express";

export interface IS3Controller {
  getUploadURL(req: Request, res: Response, next: NextFunction): Promise<void>;
}
