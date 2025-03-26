import { NextFunction, Request, Response } from "express";

import { BaseRoute } from "../base.route";
import {
  adminLogoutController,
  adminMiddleware,
  adminSigninController,
  getAllUsersController,
  refreshTokenController,
  updateUserController,
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
      "/refresh-token",
      (req: Request, res: Response, next: NextFunction) => {
        refreshTokenController.handle(req, res, next, "admin");
      }
    );

    this.router.get(
      "/users",
      (req: Request, res: Response, next: NextFunction) => {
        adminMiddleware.authenticate(req, res, next);
      },
      (req: Request, res: Response, next: NextFunction) => {
        getAllUsersController.handle(req, res, next);
      }
    );

    this.router.patch(
      "/users/:id",
      (req: Request, res: Response, next: NextFunction) => {
        adminMiddleware.authenticate(req, res, next);
      },
      (req: Request, res: Response, next: NextFunction) => {
        updateUserController.handle(req, res, next);
      }
    );

    this.router.post(
      "/logout",
      (req: Request, res: Response, next: NextFunction) => {
        adminLogoutController.handle(req, res, next);
      }
    );
  }
}
