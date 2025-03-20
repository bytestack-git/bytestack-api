import { NextFunction, Request, Response } from "express";

export interface ILogoutController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
