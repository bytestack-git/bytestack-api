import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ISendEmailUseCase } from "../../../domain/interfaces/usecaseInterface/auth/send-email.usecase.interface";
import { ISendOtpController } from "../../../domain/interfaces/controllerInterface/auth/send-otp.controller.interface";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class SendOtpController implements ISendOtpController {
  constructor(
    @inject("ISendEmailUseCase") private sendEmailUseCase: ISendEmailUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { email, type } = req.body;
    try {
      const { message, status, success } = await this.sendEmailUseCase.execute({
        email,
        type,
      });

      res.status(status).json({ message, success });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MSG.INTERNAL_SERVER_ERROR;

      let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;

      if (message === ERROR_MSG.EMAIL_ALREADY_EXIST) {
        status = HTTP_STATUS.CONFLICT;
      }

      if (
        message === ERROR_MSG.REQUIRED_FIELD_MISSING ||
        message === ERROR_MSG.INVALID_DATA ||
        message === ERROR_MSG.INVALID_EMAIL_TYPE
      ) {
        status = HTTP_STATUS.BAD_REQUEST;
      }

      res.status(status).json({ message });
    }
  }
}
