import { Request, Response, NextFunction } from "express";

export interface IAdminMiddleware {
  authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
