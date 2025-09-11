import { inject, injectable } from "tsyringe";
import { IGetBloggersUseCase } from "../../../domain/interfaces/usecaseInterface/profile/get-bloggers.usecase.interface";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../domain/errors/validation.error";
import { DataResponse } from "../../../shared/dtos/response.types";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class GetBloggersController implements IController {
  constructor(
    @inject("IGetBloggersUseCase")
    private getBloggersUseCase: IGetBloggersUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = "1", limit = "10", search = "" } = req.query;
      const user = req.user.id;

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

      const result = await this.getBloggersUseCase.execute(
        user,
        paginationData
      );

      const response: DataResponse<typeof result.bloggers> = {
        success: true,
        data: result.bloggers || [],
        meta: {
          page: paginationData.page,
          limit: paginationData.limit,
          total: result.total,
        },
        message: result.bloggers
          ? "Bloggers fetched successfully"
          : "No bloggers found",
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
