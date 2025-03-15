import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ISignupController } from "../../../domain/interfaces/controllerInterface/auth/signup.controller.interface";
import { HTTP_STATUS, ERROR_MSG } from "../../../shared/constants";
import { ISignupUseCase } from "../../../domain/interfaces/usecaseInterface/auth/signup.usecase.interface";

@injectable()
export class SignupController implements ISignupController {
  constructor(
    @inject("ISignupUseCase") private signupUseCase: ISignupUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    try {
      const { status, message, success } = await this.signupUseCase.execute(
        name,
        email,
        password
      );

      res.status(status).json({ message, success });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : ERROR_MSG.INTERNAL_SERVER_ERROR;

      let status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      if (message === ERROR_MSG.CONFLICT) status = HTTP_STATUS.CONFLICT;
      if (
        message === ERROR_MSG.REQUIRED_FIELD_MISSING ||
        message === ERROR_MSG.INVALID_DATA
      ) {
        status = HTTP_STATUS.BAD_REQUEST;
      }
      res.status(status).json({ message });
    }
  }
}
