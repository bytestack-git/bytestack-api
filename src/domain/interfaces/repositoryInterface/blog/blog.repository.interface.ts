import { UpdateWriteOpResult } from "mongoose";
import { Pagination } from "../../../../shared/dtos/pagination.dto";
import { IBlogEntity } from "../../../entities/models/blog.entity";

export interface IBlogRepository {
  save(blog: IBlogEntity): Promise<IBlogEntity>;
  update(id: string, blog: Partial<IBlogEntity>): Promise<UpdateWriteOpResult>;
  findById(id: string): Promise<IBlogEntity | null>;
  // find(data: Pagination): Promise<Partial<IBlogEntity[] | []>>;
  // delete(id: string): Promise<UpdateWriteOpResult>;
}
