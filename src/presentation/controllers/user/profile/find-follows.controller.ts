import { Request, Response, NextFunction } from "express";
import { IFindFollowsController } from "../../../../domain/interfaces/controllerInterface/user/profile/find-follows.controller.interface";
import { inject, injectable } from "tsyringe";
import { BaseError } from "../../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../../shared/constants/status-codes";
import { IFindFollowsUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/find-follows.usecase.interface";

@injectable()
export class FindFollowsController implements IFindFollowsController {
  constructor(
    @inject("IFindFollowsUseCase")
    private findFollowsUsecase: IFindFollowsUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user.id;
      const type = req.params.type;

      if (type !== "followers" && type !== "followings") {
        throw new BaseError(
          ERROR_MSG.INVALID_REQUEST,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      const response = await this.findFollowsUsecase.execute(id, type);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
