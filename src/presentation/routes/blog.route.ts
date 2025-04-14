import { NextFunction, Request, Response } from "express";
import { BaseRoute } from "./base.route";
import {
  authMiddleware,
  createBlogController,
} from "../../infrastructure/di/resolver";

export class BlogRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/",
      (req: Request, res: Response, next: NextFunction) =>
        authMiddleware.authenticate(req, res, next),
      (req: Request, res: Response, next: NextFunction) =>
        createBlogController.handle(req, res, next)
    );
  }
}
