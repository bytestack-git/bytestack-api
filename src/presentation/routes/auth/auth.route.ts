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
} from "../../../infrastructure/di/resolver";
export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post("/send-otp", (req: Request, res: Response) => {
      sendOtpController.handle(req, res);
    });

    this.router.post("/signup", (req: Request, res: Response) => {
      signupController.handle(req, res);
    });

    this.router.post("/forgot-password", (req: Request, res: Response) => {
      const { email } = req.body;
      req.body = { email, type: "forgot-password" };
      sendOtpController.handle(req, res);
    });

    this.router.post("/reset-password", (req: Request, res: Response) => {
      resetPasswordController.handle(req, res);
    });

    this.router.post("/login", (req: Request, res: Response) => {
      loginController.handle(req, res);
    });

    this.router.post("/refresh-token", (req: Request, res: Response) => {
      refreshTokenController.handle(req, res);
    });

    this.router.post("/logout", (req: Request, res: Response) => {
      logoutController.handle(req, res);
    });

    // Protected route for testing
    this.router.get(
      "/protected",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response) => {
        res
          .status(200)
          .json({ message: "Protected route accessed", user: req.user });
      }
    );
  }
}
