import { injectable, inject } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { IGetUserController } from "../../../domain/interfaces/controllerInterface/user/get-user.controller.interface";
import { IGetUserUseCase } from "../../../domain/interfaces/usecaseInterface/user/get-user.usecase.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";

@injectable()
export class GetUserController implements IGetUserController {
  constructor(
    @inject("IGetUserUseCase") private getUserByIdUseCase: IGetUserUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user;
      if (!userId) {
        throw new BaseError(
          "User ID not found in request",
          HTTP_STATUS.UNAUTHORIZED,
          true
        );
      }

      const { status, message, success, user } =
        await this.getUserByIdUseCase.execute(userId.id);

      res.status(status).json({ message, success, user });
    } catch (error) {
      next(error);
    }
  }
}
