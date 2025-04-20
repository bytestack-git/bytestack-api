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

    const charCount = blog.content.length;
    const readingSpeedCpm = 500;
    const readTimeMinutes = Math.ceil(charCount / readingSpeedCpm);
    const readTime =
      readTimeMinutes > 0
        ? `${readTimeMinutes} min${readTimeMinutes > 1 ? "s" : ""}`
        : "1 min";

    const blogData = {
      ...blog,
      userId,
      slug,
      readTime,
      publishedAt: blog.status === "published" ? new Date() : undefined,
    };

    let newBlog: IBlogEntity;

    try {
      newBlog = await this.blogRepository.save(userId, blogData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "MongoServerError" && error.code === 11000) {
        throw new BaseError(
          "A blog with this title already exists",
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

    return {
      blog: newBlog,
      success: SUCCESS_MSG.BLOG_CREATED,
      status: HTTP_STATUS.CREATED,
    };
  }
}
