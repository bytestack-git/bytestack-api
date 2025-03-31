import { Request, Response, NextFunction } from "express";
import { IUpdateProfileController } from "../../../../domain/interfaces/controllerInterface/user/profile/update-profile.controller.interface";
import { inject, injectable } from "tsyringe";
import { IUpdateProfileUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/update-profile.usecase.interface";
import { BaseError } from "../../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../../shared/constants/status-codes";

@injectable()
export class UpdateProfileController implements IUpdateProfileController {
  constructor(
    @inject("IUpdateProfileUsecase")
    private updateProfileUsecase: IUpdateProfileUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { body, user } = req;

    if (!user) {
      throw new BaseError(
        "User not found in request",
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    console.log("body from the controller", body);
    try {
      const { data, success, status, message } =
        await this.updateProfileUsecase.execute(user.id, body);

      res.status(status).json({ message, success, data });
    } catch (error) {
      next(error);
    }
  }
}
