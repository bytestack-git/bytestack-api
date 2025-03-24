import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IAdminLogoutUseCase } from "../../../domain/interfaces/usecaseInterface/admin/admin-logout.usecase.interface";
import { IAdminLogoutController } from "../../../domain/interfaces/controllerInterface/admin/admin-logout.controller.interface";

@injectable()
export class AdminLogoutController implements IAdminLogoutController {
  constructor(
    @inject("IAdminLogoutUseCase") private logoutUseCase: IAdminLogoutUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      const result = await this.logoutUseCase.execute(refreshToken);

      res.clearCookie("accessToken", { path: "/admin" });
      res.clearCookie("refreshToken", { path: "/admin" });

      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  }
}
