import { Request, Response, NextFunction } from "express";

export interface IRefreshTokenController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}