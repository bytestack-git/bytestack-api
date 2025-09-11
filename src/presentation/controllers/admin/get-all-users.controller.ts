import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IGetAllUsersUsecase } from "../../../domain/interfaces/usecaseInterface/admin/get-all-users.usecase.interface";
import { DataResponse } from "../../../shared/dtos/response.types";
import { ValidationError } from "../../../domain/errors/validation.error";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class GetAllUsersController implements IController {
  constructor(
    @inject("IGetAllUsersUsecase")
    private getAllUsersUsecase: IGetAllUsersUsecase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = "1", limit = "10", search = "", status } = req.query;

      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError("Page must be a positive integer");
      }
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
        throw new ValidationError("Limit must be a positive integer between 1 and 50");
      }

      const paginationData = {
        page: pageNum,
        limit: limitNum,
        search: String(search),
        status: String(status),
      };

      const result = await this.getAllUsersUsecase.execute(paginationData);

      const response: DataResponse<typeof result.users> = {
        success: true,
        data: result.users || [],
        meta: {
          page: paginationData.page,
          limit: paginationData.limit,
          total: result.total,
        },
        message: result.users ? "Users fetched successfully" : "No users found",
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
