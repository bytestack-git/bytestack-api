import { inject, injectable } from "tsyringe";
import { ICreateBlogUseCase } from "../../../domain/interfaces/usecaseInterface/blog/create-blog.usecase.interface";
import { Request, Response, NextFunction } from "express";
import {
  BlogRequestDTO,
  blogRequestSchema,
} from "../../../shared/validation/schemas";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ZodError } from "zod";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { sendResponse } from "../../../shared/utils/response-handler";
import { IController } from "../../../domain/interfaces/controllerInterface/common/controller.interface";

@injectable()
export class CreateBlogController implements IController {
  constructor(
    @inject("ICreateBlogUseCase")
    private createBlogUseCase: ICreateBlogUseCase
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      let validatedData: BlogRequestDTO;

      try {
        validatedData = blogRequestSchema.parse(req.body);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new BaseError(
            ERROR_MSG.INVALID_DATA,
            HTTP_STATUS.BAD_REQUEST,
            true
          );
        }
        throw new BaseError(
          "Failed to validate input data",
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          false
        );
      }

      const { blog, status, success, message } =
        await this.createBlogUseCase.execute(userId, validatedData);

      sendResponse(res, {
        status,
        success,
        message,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }
}
