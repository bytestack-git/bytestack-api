import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IAdminSigninUseCase } from "../../../domain/interfaces/usecaseInterface/admin/signin.usecase.interface";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class AdminSigninController implements IController {
  constructor(
    @inject("IAdminSigninUseCase")
    private adminSigninUseCase: IAdminSigninUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.adminSigninUseCase.execute(req.body);

      res.cookie("_accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("_refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(result.status).json({
        message: result.message,
        success: result.success,
        admin: result.admin,
      });
    } catch (error) {
      next(error);
    }
  }
}
