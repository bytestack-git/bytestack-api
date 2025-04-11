import { Request, Response, NextFunction } from "express";
import { IFindFollowsController } from "../../../domain/interfaces/controllerInterface/profile/find-follows.controller.interface";
import { inject, injectable } from "tsyringe";
import { BaseError } from "../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { IFindFollowsUseCase } from "../../../domain/interfaces/usecaseInterface/profile/find-follows.usecase.interface";
import { ValidationError } from "../../../domain/errors/validation.error";

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
      const { page = "1", limit = "10", search = "" } = req.query;

      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError("Page must be a positive integer");
      }
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
        throw new ValidationError(
          "Limit must be a positive integer between 1 and 50"
        );
      }

      const paginationData = {
        page: pageNum,
        limit: limitNum,
        search: String(search),
      };

      if (type !== "followers" && type !== "followings") {
        throw new BaseError(
          ERROR_MSG.INVALID_REQUEST,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }

      const response = await this.findFollowsUsecase.execute(
        id,
        type,
        paginationData
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
