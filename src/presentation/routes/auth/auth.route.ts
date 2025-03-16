import { Request, Response } from "express";
import { BaseRoute } from "../base.route";
import {
  signupController,
  sendOtpController,
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
  }
}
