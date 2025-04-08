import { Request, Response, NextFunction } from "express";

export interface IForgotPasswordController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}