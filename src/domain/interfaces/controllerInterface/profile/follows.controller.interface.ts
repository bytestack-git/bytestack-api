import { NextFunction, Request, Response } from "express";

export interface IFollowsController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
