import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ILogoutUseCase } from "../../../domain/interfaces/usecaseInterface/auth/logout.usecase.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class LogoutController implements IController {
  constructor(
    @inject("ILogoutUseCase") private logoutUseCase: ILogoutUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new BaseError(
          ERROR_MSG.ALREADY_LOGGED_OUT,
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }

      const { status, message, success } =
        await this.logoutUseCase.execute(refreshToken);

      // Clear the cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(status).json({ message, success });
    } catch (error) {
      next(error);
    }
  }
}
