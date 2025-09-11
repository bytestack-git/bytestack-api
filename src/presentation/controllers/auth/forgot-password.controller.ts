import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IForgotPasswordUseCase } from "../../../domain/interfaces/usecaseInterface/auth/forgot-password.usecase.interface";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class ForgotPasswordController implements IController {
  constructor(
    @inject("IForgotPasswordUseCase") private forgotPasswordUseCase: IForgotPasswordUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const { status, message, success } = await this.forgotPasswordUseCase.execute({ email, type: "forgot-password" });

      res.status(status).json({ message, success });
    } catch (error) {
      next(error);
    }
  }
}