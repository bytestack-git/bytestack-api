import { inject, injectable } from "tsyringe";
import { ICreateBlogUseCase } from "../../../domain/interfaces/usecaseInterface/blog/create-blog.usecase.interface";
import { IBlogRepository } from "../../../domain/interfaces/repositoryInterface/blog/blog.repository.interface";
import { IBlogEntity } from "../../../domain/entities/models/blog.entity";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { BaseError } from "../../../domain/errors/base.error";
import { BlogRequestDTO } from "../../../shared/validation/schemas";
import { generateBlogSlug } from "../../../shared/utils/slug.utils";

@injectable()
export class CreateBlogUseCase implements ICreateBlogUseCase {
  constructor(
    @inject("IBlogRepository") private blogRepository: IBlogRepository
  ) {}

  async execute(
    userId: string,
    blog: BlogRequestDTO
  ): Promise<{ blog: IBlogEntity; success: string; status: number }> {
    const slug = generateBlogSlug(blog.title);
    const newBlog = await this.blogRepository.save(userId, { ...blog, slug });

    if (!newBlog) {
      throw new BaseError(
        ERROR_MSG.DATABASE_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    return {
      blog: newBlog,
      success: SUCCESS_MSG.BLOG_CREATED,
      status: HTTP_STATUS.CREATED,
    };
  }
}
