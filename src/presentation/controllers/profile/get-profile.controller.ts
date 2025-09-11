import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IGetProfileUseCase } from "../../../domain/interfaces/usecaseInterface/profile/get-profile.usecase.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";


@injectable()
export class GetProfileController implements IController {
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
