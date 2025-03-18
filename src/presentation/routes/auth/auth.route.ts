import { Request, Response } from "express";
import { BaseRoute } from "../base.route";
import {
  signupController,
  sendOtpController,
  resetPasswordController,
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
  }
}
