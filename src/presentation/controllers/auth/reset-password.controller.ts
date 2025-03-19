// src/presentation/controllers/auth/reset-password.controller.ts
import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { IResetPasswordUseCase } from "../../../domain/interfaces/usecaseInterface/auth/reset-password.usecase.interface";
import { IResetPasswordController } from "../../../domain/interfaces/controllerInterface/auth/reset-password.controller.interface";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";

@injectable()
export class ResetPasswordController implements IResetPasswordController {
  constructor(
    @inject("IResetPasswordUseCase")
    private resetPasswordUseCase: IResetPasswordUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, newPassword } = req.body;
      const { status, message, success } =
        await this.resetPasswordUseCase.execute({
          email,
          otp,
          newPassword,
        });

      res.status(status).json({ message, success });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MSG.INTERNAL_SERVER_ERROR;

      let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

      if (message === ERROR_MSG.EMAIL_NOT_FOUND) {
        status = HTTP_STATUS.NOT_FOUND;
      }

      if (
        message === ERROR_MSG.OTP_EXPIRED ||
        message === ERROR_MSG.INVALID_DATA ||
        message === ERROR_MSG.INVALID_EMAIL_TYPE ||
        message === ERROR_MSG.INVALID_OTP
      ) {
        status = HTTP_STATUS.BAD_REQUEST;
      }

      res.status(status).json({ message });
    }
  }
}
