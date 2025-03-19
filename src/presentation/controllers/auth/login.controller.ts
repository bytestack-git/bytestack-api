import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ILoginUseCase } from "../../../domain/interfaces/usecaseInterface/auth/login.usecase.interface";
import { ILoginController } from "../../../domain/interfaces/controllerInterface/auth/login.controller.interface";

@injectable()
export class LoginController implements ILoginController {
  constructor(@inject("ILoginUseCase") private loginUseCase: ILoginUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { status, message, success, tokens } =
        await this.loginUseCase.execute({ email, password });

      if (tokens) {
        res.cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      res.status(status).json({ message, success });
    } catch (error) {
      //   ToDO add error validation
    }
  }
}
