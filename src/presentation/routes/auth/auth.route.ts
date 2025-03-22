import { NextFunction, Request, Response } from "express";
import { BaseRoute } from "../base.route";
import {
  signupController,
  sendOtpController,
  resetPasswordController,
  loginController,
  refreshTokenController,
  logoutController,
  authMiddleware,
  forgotPasswordController,
} from "../../../infrastructure/di/resolver";
export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/send-otp",
      (req: Request, res: Response, next: NextFunction) => {
        sendOtpController.handle(req, res, next);
      }
    );

    this.router.post(
      "/signup",
      (req: Request, res: Response, next: NextFunction) => {
        signupController.handle(req, res, next);
      }
    );

    this.router.post(
      "/forgot-password",
      (req: Request, res: Response, next: NextFunction) => {
        forgotPasswordController.handle(req, res, next);
      }
    );

    this.router.post(
      "/reset-password",
      (req: Request, res: Response, next: NextFunction) => {
        resetPasswordController.handle(req, res, next);
      }
    );

    this.router.post(
      "/login",
      (req: Request, res: Response, next: NextFunction) => {
        loginController.handle(req, res, next);
      }
    );

    this.router.post(
      "/refresh-token",
      (req: Request, res: Response, next: NextFunction) => {
        refreshTokenController.handle(req, res, next);
      }
    );

    this.router.post(
      "/logout",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        logoutController.handle(req, res, next);
      }
    );
  }
}
