import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IFollowsUseCase } from "../../../domain/interfaces/usecaseInterface/profile/follows.usecase.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class FollowsController implements IController {
  constructor(
    @inject("IFollowsUsecase") private followsUsecase: IFollowsUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const followerId = req.user.id;
      const followingId = req.params.id;
      const action = req.params.action as "follow" | "unfollow";

      if (action !== "follow" && action !== "unfollow") {
        throw new BaseError(
          ERROR_MSG.INVALID_DATA,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      await this.followsUsecase.execute(followerId, followingId, action);

      res.status(200).json({ message: `${action} successfully` });
    } catch (error) {
      next(error);
    }
  }
}
