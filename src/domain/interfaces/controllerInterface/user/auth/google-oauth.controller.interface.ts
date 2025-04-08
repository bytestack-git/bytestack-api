import { Request, Response, NextFunction } from "express";

export interface IGoogleOAuthController {
  handleGoogleOAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
}