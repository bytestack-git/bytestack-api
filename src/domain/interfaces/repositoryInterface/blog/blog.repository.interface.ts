import { UpdateWriteOpResult } from "mongoose";
// import { Pagination } from "../../../../shared/dtos/pagination.dto";
import { IBlogEntity } from "../../../entities/models/blog.entity";
import { BlogRequestDTO } from "../../../../shared/validation/schemas";

export interface IBlogRepository {
  save(userId: string, blog: BlogRequestDTO): Promise<IBlogEntity>;
  update(id: string, blog: Partial<BlogRequestDTO>): Promise<UpdateWriteOpResult>;
  findById(id: string): Promise<IBlogEntity | null>;
  findBySlug(slug: string): Promise<IBlogEntity | null>;
  findByTitle(title: string): Promise<IBlogEntity | null>;
  isTitleTaken(title: string, excludeId?: string): Promise<boolean>
  // find(data: Pagination): Promise<Partial<IBlogEntity[] | []>>;
  // delete(id: string): Promise<UpdateWriteOpResult>;
}
