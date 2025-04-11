import { Request, Response, NextFunction } from "express";

export interface IGetProfileController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
