import { NextFunction, Request, Response } from "express";

export interface IResetPasswordController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
