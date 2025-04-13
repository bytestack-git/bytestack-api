import { IBlogEntity } from "../../../entities/models/blog.entity";

export interface ICreateBlogUseCase {
  execute(
    blog: IBlogEntity
  ): Promise<{ blog: IBlogEntity; success: string; status: number }>;
}
