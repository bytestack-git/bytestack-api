import { Request, Response, NextFunction } from "express";

export interface IGitHubOAuthController {
  handleGitHubOAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
}