import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { BaseError } from "../../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../../shared/constants/status-codes";
import { IGetProfileController } from "../../../../domain/interfaces/controllerInterface/user/profile/get-profile.controller.interface";
import { IGetProfileUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/get-profile.usecase.interface";
import { ERROR_MSG } from "../../../../shared/constants/error-msg";

@injectable()
export class GetProfileController implements IGetProfileController {
  constructor(
    @inject("IGetProfileUseCase") private getProfileUsecase: IGetProfileUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.user;
      const userId = req.user.id;
      if (!slug) {
        throw new BaseError(
          ERROR_MSG.USER_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
          true
        );
      }

      const { status, ...data } = await this.getProfileUsecase.execute(
        slug,
        userId
      );

      res.status(status).json(data);
    } catch (error) {
      next(error);
    }
  }
}
