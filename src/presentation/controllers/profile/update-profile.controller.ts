import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IUpdateProfileController } from "../../../domain/interfaces/controllerInterface/profile/update-profile.controller.interface";
import { IUpdateProfileUseCase } from "../../../domain/interfaces/usecaseInterface/profile/update-profile.usecase.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";

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
        ERROR_MSG.USER_NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    try {
      const { data, success, status, message } =
        await this.updateProfileUsecase.execute(user.id, body);

      res.status(status).json({ message, success, user: data });
    } catch (error) {
      next(error);
    }
  }
}
