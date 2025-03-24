import { NextFunction, Request, Response } from "express";

import { BaseRoute } from "../base.route";
import {
  adminMiddleware,
  adminSigninController,
} from "../../../infrastructure/di/resolver";

export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/login",
      (req: Request, res: Response, next: NextFunction) => {
        adminSigninController.handle(req, res, next);
      }
    );

    this.router.post(
      "/test",
      (req: Request, res: Response, next: NextFunction) => {
        adminMiddleware.authenticate(req, res, next);
      },
      (req, res) => {
        console.log(req.body);
      }
    );
  }
}
