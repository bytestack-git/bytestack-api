import { BlogRequestDTO } from "../../../../shared/validation/schemas";

export interface IEditBlogUseCase {
  execute(
    blogId: string,
    userId: string,
    blog: BlogRequestDTO
  ): Promise<{ success: string; status: number }>;
}
