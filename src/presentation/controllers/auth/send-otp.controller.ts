import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ISendEmailUseCase } from "../../../domain/interfaces/usecaseInterface/auth/send-email.usecase.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class SendOtpController implements IController {
  constructor(
    @inject("ISendEmailUseCase") private sendEmailUseCase: ISendEmailUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, type } = req.body;

    try {
      // Validate required fields
      if (!email || !type) {
        throw new BaseError(
          ERROR_MSG.REQUIRED_FIELD_MISSING,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      const { message, status, success } = await this.sendEmailUseCase.execute({
        email,
        type,
      });

      res.status(status).json({ message, success });
    } catch (error) {
      // Pass the error to the errorHandler middleware
      next(error);
    }
  }
}
