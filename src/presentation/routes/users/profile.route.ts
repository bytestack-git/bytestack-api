import { NextFunction, Request, Response } from "express";
import {
  authMiddleware,
  findFollowsController,
  followsController,
  getBloggersController,
  getProfileController,
  getUserController,
  s3Controller,
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

    this.router.get(
      "/bloggers",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        getBloggersController.handle(req, res, next);
      }
    );

    this.router.get(
      "/u/:user",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        getProfileController.handle(req, res, next);
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

    this.router.post(
      "/upload-url",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        s3Controller.getUploadURL(req, res, next);
      }
    );

    this.router.post(
      "/:id/:action",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        followsController.handle(req, res, next);
      }
    );

    this.router.get(
      "/relation/:type",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) => {
        findFollowsController.handle(req, res, next);
      }
    );
  }
}
