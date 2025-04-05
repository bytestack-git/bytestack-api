import { Request, Response, NextFunction } from "express";

export interface IGetBloggersController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
