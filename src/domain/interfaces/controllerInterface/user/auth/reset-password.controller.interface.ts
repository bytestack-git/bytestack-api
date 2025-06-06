import { Request, Response, NextFunction } from "express";

export interface IResetPasswordController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
