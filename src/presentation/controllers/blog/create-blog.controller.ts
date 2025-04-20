import { inject, injectable } from "tsyringe";
import { ICreateBlogController } from "../../../domain/interfaces/controllerInterface/blog/create-blog.controller.interface";
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
import { successResponse } from "../../../shared/utils/responseHandler";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";

@injectable()
export class CreateBlogController implements ICreateBlogController {
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


      const { blog, status, success } = await this.createBlogUseCase.execute(
        userId,
        validatedData
      );

      successResponse(res, blog, SUCCESS_MSG.BLOG_CREATED);
      // res.status(status).json({ blog, success });
    } catch (error) {
      next(error);
    }
  }
}
