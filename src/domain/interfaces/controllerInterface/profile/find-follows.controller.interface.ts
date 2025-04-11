import { NextFunction, Request, Response } from "express";

export interface IFindFollowsController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
