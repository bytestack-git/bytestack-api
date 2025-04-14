import { NextFunction, Request, Response } from "express";

export interface ICreateBlogController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
