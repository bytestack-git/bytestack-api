import { Request, Response } from "express";
import { BaseRoute } from "../base.route";
import { signupController } from "../../../infrastructure/di/resolver";

export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post("/signup", (req: Request, res: Response) => {
      console.log(req.body);
      signupController.handle(req, res);
    });
  }
}
