import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IResetPasswordUseCase } from "../../../domain/interfaces/usecaseInterface/auth/reset-password.usecase.interface";
import { IResetPasswordController } from "../../../domain/interfaces/controllerInterface/auth/reset-password.controller.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class ResetPasswordController implements IResetPasswordController {
  constructor(
    @inject("IResetPasswordUseCase")
    private resetPasswordUseCase: IResetPasswordUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, otp, newPassword } = req.body;

    try {
      // Basic input validation
      if (!email || !otp || !newPassword) {
        throw new BaseError(
          ERROR_MSG.REQUIRED_FIELD_MISSING,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      const { status, message, success } =
        await this.resetPasswordUseCase.execute({
          email,
          otp,
          newPassword,
        });

      res.status(status).json({ message, success });
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }
}