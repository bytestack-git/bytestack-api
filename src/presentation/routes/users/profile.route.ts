import { NextFunction, Request, Response } from "express";
import {
  authMiddleware,
  getUserController,
  updateProfileController,
} from "../../../infrastructure/di/resolver";
import { BaseRoute } from "../base.route";

export class UserRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get(
      "/",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        getUserController.handle(req, res, next);
      }
    );

    this.router.put(
      "/",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        updateProfileController.handle(req, res, next);
      }
    );
  }
}
