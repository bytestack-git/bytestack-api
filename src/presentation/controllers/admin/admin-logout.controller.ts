import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IAdminLogoutUseCase } from "../../../domain/interfaces/usecaseInterface/admin/admin-logout.usecase.interface";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class AdminLogoutController implements IController {
  constructor(
    @inject("IAdminLogoutUseCase") private logoutUseCase: IAdminLogoutUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies._refreshToken;

      if (refreshToken) this.logoutUseCase.execute(refreshToken);

      res.clearCookie("_accessToken");
      res.clearCookie("_refreshToken");

      res.status(200).json({ message: SUCCESS_MSG.LOGOUT_SUCCESSFUL });
    } catch (error) {
      next(error);
    }
  }
}
