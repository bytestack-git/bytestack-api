import { FilterQuery, UpdateWriteOpResult } from "mongoose";
import { IBlogEntity } from "../../../domain/entities/models/blog.entity";
import { IBlogRepository } from "../../../domain/interfaces/repositoryInterface/blog/blog.repository.interface";
import { BlogModel } from "../../database/mongoose/models/blog.model";
import { BlogRequestDTO } from "../../../shared/validation/schemas";
// import { Pagination } from "../../../shared/dtos/pagination.dto";

export class BlogRepository implements IBlogRepository {
  async save(userId: string, blog: BlogRequestDTO): Promise<IBlogEntity> {
    return await BlogModel.create(blog);
  }

  async findById(id: string): Promise<IBlogEntity | null> {
    return await BlogModel.findById(id);
  }

  async update(
    id: string,
    blog: Partial<IBlogEntity>
  ): Promise<UpdateWriteOpResult> {
    return await BlogModel.updateOne({ _id: id }, { $set: blog });
  }

  async findBySlug(slug: string): Promise<IBlogEntity | null> {
    return await BlogModel.findOne({ slug });
  }

  async findByTitle(title: string): Promise<IBlogEntity | null> {
    return await BlogModel.findOne({ title });
  }

  async isTitleTaken(title: string, excludeId?: string): Promise<boolean> {
    const query: FilterQuery<IBlogEntity> = {
      title: new RegExp(`^${title.trim()}$`, "i"),
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await BlogModel.findOne(query).lean();
    return !!existing;
  }

  // async find(data: Pagination): Promise<Partial<IBlogEntity[] | []>> {
  //   const { limit, page, search, status, sort } = data;
  //   const skip = (page - 1) * limit;
  // }
}
