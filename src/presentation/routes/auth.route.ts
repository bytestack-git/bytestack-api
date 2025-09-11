import { NextFunction, Request, Response } from "express";
import { BaseRoute } from "./base.route";
import {
  signupController,
  sendOtpController,
  resetPasswordController,
  loginController,
  refreshTokenController,
  logoutController,
  forgotPasswordController,
  googleOAuthController,
  githubOAuthController,
} from "../../infrastructure/di/resolver";
import { rateLimiter } from "../middleware/rate-limit.middleware";
export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/send-otp",
      rateLimiter,
      (req: Request, res: Response, next: NextFunction) => {
        sendOtpController.handle(req, res, next);
      }
    );

    this.router.post(
      "/signup",
      rateLimiter,
      (req: Request, res: Response, next: NextFunction) => {
        signupController.handle(req, res, next);
      }
    );

    this.router.post(
      "/forgot-password",
      rateLimiter,
      (req: Request, res: Response, next: NextFunction) => {
        forgotPasswordController.handle(req, res, next);
      }
    );

    this.router.post(
      "/reset-password",
      rateLimiter,
      (req: Request, res: Response, next: NextFunction) => {
        resetPasswordController.handle(req, res, next);
      }
    );

    this.router.post(
      "/login",
      rateLimiter,
      (req: Request, res: Response, next: NextFunction) => {
        loginController.handle(req, res, next);
      }
    );

    this.router.post(
      "/refresh-token",
      (req: Request, res: Response, next: NextFunction) => {
        refreshTokenController.handle(req, res, next, "user");
      }
    );

    this.router.post(
      "/google",
      (req: Request, res: Response, next: NextFunction) => {
        googleOAuthController.handle(req, res, next);
      }
    );

    this.router.post(
      "/github",
      (req: Request, res: Response, next: NextFunction) => {
        githubOAuthController.handle(req, res, next);
      }
    );

    this.router.post(
      "/logout",
      (req: Request, res: Response, next: NextFunction) => {
        logoutController.handle(req, res, next);
      }
    );
  }
}
