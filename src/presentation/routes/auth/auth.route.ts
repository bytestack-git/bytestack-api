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
      console.log(req.body);
      sendOtpController.handle(req, res);
    });

    this.router.post("/signup", (req: Request, res: Response) => {
      console.log(req.body);
      signupController.handle(req, res);
    });

    this.router.post("/signin", (req: Request, res: Response) => {
      console.log(req.body);
      res.status(200).json({success: true, message: "LOgin dneoennjnsldnlnflsmlsdmlkmsdlkmdsflkmflmsldmfs"})
      // signupController.handle(req, res);
    });
  }
}
