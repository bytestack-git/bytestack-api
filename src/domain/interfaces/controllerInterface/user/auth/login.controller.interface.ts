import { NextFunction, Request, Response } from "express";

export interface ILoginController {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
