// src/presentation/controllers/auth/logout.controller.ts
import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { ILogoutUseCase } from "../../../domain/interfaces/usecaseInterface/auth/logout.usecase.interface";
import { ILogoutController } from "../../../domain/interfaces/controllerInterface/auth/logout.controller.interface";

@injectable()
export class LogoutController implements ILogoutController {
  constructor(
    @inject("ILogoutUseCase") private logoutUseCase: ILogoutUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const accessToken = req.cookies.accessToken;
      const { status, message, success } =
        await this.logoutUseCase.execute(accessToken);

      // Clear the cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(status).json({ message, success });
    } catch (error) {
      //   Handle error here
    }
  }
}
