import { NextFunction, Request, Response } from "express";
import {
  authMiddleware,
  getUserController,
} from "../../../infrastructure/di/resolver";
import { BaseRoute } from "../base.route";

export class UserRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get(
      "/me",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        getUserController.handle(req, res, next);
      }
    );
  }
}
