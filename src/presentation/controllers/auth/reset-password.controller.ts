import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IResetPasswordUseCase } from "../../../domain/interfaces/usecaseInterface/auth/reset-password.usecase.interface";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class ResetPasswordController implements IController {
  constructor(
    @inject("IResetPasswordUseCase")
    private resetPasswordUseCase: IResetPasswordUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      const { status, message, success } =
        await this.resetPasswordUseCase.execute({ token, newPassword });

      res.status(status).json({ message, success });
    } catch (error) {
      next(error);
    }
  }
}
