import { Request, Response, NextFunction } from "express";

export interface ISignupController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
