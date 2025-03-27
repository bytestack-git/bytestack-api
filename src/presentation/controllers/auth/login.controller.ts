import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ILoginUseCase } from "../../../domain/interfaces/usecaseInterface/auth/login.usecase.interface";
import { ILoginController } from "../../../domain/interfaces/controllerInterface/auth/login.controller.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class LoginController implements ILoginController {
  constructor(@inject("ILoginUseCase") private loginUseCase: ILoginUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Basic input validation
      if (!email || !password) {
        throw new BaseError(
          ERROR_MSG.REQUIRED_FIELD_MISSING,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      const { status, message, success, tokens, user } =
        await this.loginUseCase.execute({ email, password });

      if (tokens) {
        res.cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000, // 15 minutes
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      res.status(status).json({ message, success, user });
    } catch (error) {
      next(error);
    }
  }
}
