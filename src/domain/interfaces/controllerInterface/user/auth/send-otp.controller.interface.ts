import { NextFunction, Request, Response } from "express";

export interface ISendOtpController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
