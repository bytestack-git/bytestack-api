import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ISignupController } from "../../../domain/interfaces/controllerInterface/auth/signup.controller.interface";
import { ISignupUseCase } from "../../../domain/interfaces/usecaseInterface/auth/signup.usecase.interface";

@injectable()
export class SignupController implements ISignupController {
  constructor(
    @inject("ISignupUseCase") private signupUseCase: ISignupUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, email, password, otp } = req.body;

    try {
      const { status, message, success } = await this.signupUseCase.execute({
        name,
        email,
        password,
        otp,
      });

      res.status(status).json({ message, success });
    } catch (error) {
      next(error);
    }
  }
}
