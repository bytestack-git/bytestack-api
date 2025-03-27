import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IRefreshTokenUseCase } from "../../../domain/interfaces/usecaseInterface/auth/refresh-token.usecase.interface";
import { IRefreshTokenController } from "../../../domain/interfaces/controllerInterface/auth/refresh-token.controller.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class RefreshTokenController implements IRefreshTokenController {
  constructor(
    @inject("IRefreshTokenUseCase")
    private refreshTokenUseCase: IRefreshTokenUseCase
  ) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction,
    expectedRole?: "admin" | "user"
  ): Promise<void> {
    try {
      const refreshTokenName =
        expectedRole === "admin" ? "_refreshToken" : "refreshToken";
      const accessTokenName =
        expectedRole === "admin" ? "_accessToken" : "accessToken";

      const refreshToken = req.cookies[refreshTokenName];

      if (!refreshToken) {
        throw new BaseError(
          ERROR_MSG.REQUIRED_FIELD_MISSING,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      const { status, message, success, accessToken } =
        await this.refreshTokenUseCase.execute(refreshToken, expectedRole);

      res.cookie(accessTokenName, accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      console.log("====", message);
      res.status(status).json({ message, success });
    } catch (error) {
      next(error);
    }
  }
}
