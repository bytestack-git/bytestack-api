import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IRefreshTokenUseCase } from "../../../domain/interfaces/usecaseInterface/auth/refresh-token.usecase.interface";
import { IRefreshTokenController } from "../../../domain/interfaces/controllerInterface/auth/refresh-token.controller.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";

@injectable()
export class RefreshTokenController implements IRefreshTokenController {
  constructor(
    @inject("IRefreshTokenUseCase")
    private refreshTokenUseCase: IRefreshTokenUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new BaseError(
          "Refresh token not found",
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }

      const { status, message, success, accessToken } =
        await this.refreshTokenUseCase.execute(refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(status).json({ message, success });
    } catch (error) {
      next(error);
    }
  }
}
