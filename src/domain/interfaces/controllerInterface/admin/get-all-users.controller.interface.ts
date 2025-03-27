import { Request, Response, NextFunction } from "express";

export interface IGetAllUsersController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
