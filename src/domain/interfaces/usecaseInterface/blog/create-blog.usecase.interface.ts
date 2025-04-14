import { BlogRequestDTO } from "../../../../shared/validation/schemas";
import { IBlogEntity } from "../../../entities/models/blog.entity";

export interface ICreateBlogUseCase {
  execute(
    userId: string,
    blog: BlogRequestDTO
  ): Promise<{ blog: IBlogEntity; success: string; status: number }>;
}
