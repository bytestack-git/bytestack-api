import { Request, Response } from "express";

export interface ISignupController {
  handle(req: Request, res: Response): Promise<void>;
}
