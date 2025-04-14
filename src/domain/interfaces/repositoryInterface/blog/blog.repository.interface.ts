import { UpdateWriteOpResult } from "mongoose";
import { Pagination } from "../../../../shared/dtos/pagination.dto";
import { IBlogEntity } from "../../../entities/models/blog.entity";
import { BlogRequestDTO } from "../../../../shared/validation/schemas";

export interface IBlogRepository {
  save(userId: string, blog: BlogRequestDTO): Promise<IBlogEntity>;
  update(id: string, blog: Partial<IBlogEntity>): Promise<UpdateWriteOpResult>;
  findById(id: string): Promise<IBlogEntity | null>;
  // find(data: Pagination): Promise<Partial<IBlogEntity[] | []>>;
  // delete(id: string): Promise<UpdateWriteOpResult>;
}
