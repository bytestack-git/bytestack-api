import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IUpdateUserUsecase } from "../../../domain/interfaces/usecaseInterface/admin/update-user.usecase.interface";
import { DataResponse } from "../../../shared/dtos/response.types";
import { ValidationError } from "../../../domain/errors/validation.error";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class UpdateUserController implements IController {
  constructor(
    @inject("IUpdateUserUsecase") private updateUserUsecase: IUpdateUserUsecase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isBanned } = req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ValidationError("Invalid user ID format");
      }

      await this.updateUserUsecase.execute(id, { isBanned });

      const response: DataResponse<null> = {
        success: true,
        data: null,
        message: `User ${isBanned ? "banned" : "unbanned"} successfully`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
