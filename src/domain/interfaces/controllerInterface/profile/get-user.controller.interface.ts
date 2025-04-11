import { Request, Response, NextFunction } from "express";

export interface IGetUserController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
