import { inject, injectable } from "tsyringe";
import { IEditBlogUseCase } from "../../../domain/interfaces/usecaseInterface/blog/update-blog.usecase.interface";
import { IBlogRepository } from "../../../domain/interfaces/repositoryInterface/blog/blog.repository.interface";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { BaseError } from "../../../domain/errors/base.error";
import { BlogRequestDTO } from "../../../shared/validation/schemas";
import { generateBlogSlug } from "../../../shared/utils/slug.utils";

@injectable()
export class EditBlogUseCase implements IEditBlogUseCase {
  constructor(
    @inject("IBlogRepository") private blogRepository: IBlogRepository
  ) {}

  async execute(
    blogId: string,
    userId: string,
    blog: BlogRequestDTO
  ): Promise<{ success: string; status: number }> {
    const existingBlog = await this.blogRepository.findById(blogId);

    if (!existingBlog) {
      throw new BaseError(ERROR_MSG.NOT_FOUND, HTTP_STATUS.NOT_FOUND, true);
    }

    if (existingBlog.userId.toString() !== userId) {
      throw new BaseError(
        ERROR_MSG.FORBIDDEN_ACCESS,
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }

    const titleTaken = await this.blogRepository.isTitleTaken(
      blog.title,
      blogId
    );

    if (titleTaken) {
      throw new BaseError(
        ERROR_MSG.DUPLICATE_BLOG_TITLE,
        HTTP_STATUS.CONFLICT,
        true
      );
    }

    const slug = generateBlogSlug(blog.title);

    const charCount = blog.content.length;
    const readingSpeedCpm = 500;
    const readTimeMinutes = Math.ceil(charCount / readingSpeedCpm);
    const readTime = readTimeMinutes > 0 ? `${readTimeMinutes} min` : "1 min";

    const blogData = {
      ...blog,
      slug,
      readTime,
      publishedAt:
        blog.status === "published" ? new Date() : existingBlog.publishedAt,
    };

    let updatedBlog;
    try {
      updatedBlog = await this.blogRepository.update(blogId, blogData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "MongoServerError" && error.code === 11000) {
        throw new BaseError(
          ERROR_MSG.DUPLICATE_BLOG_TITLE,
          HTTP_STATUS.CONFLICT,
          false
        );
      }

      throw new BaseError(
        ERROR_MSG.DATABASE_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    if (!updatedBlog) {
      throw new BaseError(
        ERROR_MSG.DATABASE_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    return {
      success: SUCCESS_MSG.BLOG_UPDATED,
      status: HTTP_STATUS.OK,
    };
  }
}
