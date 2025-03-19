import { Request, Response } from "express";

export interface ILoginController {
  handle(req: Request, res: Response): Promise<void>;
}
