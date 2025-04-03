import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { Pagination } from "../../../shared/dtos/pagination.dto";
import { UserModel } from "../../database/mongoose/models/user.model";

export class UserRepository implements IUserRepository {
  async save(user: IUserEntity): Promise<IUserEntity> {
    return await UserModel.create(user);
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    return await UserModel.findOne({ email }).lean();
  }

  async findById(id: string): Promise<IUserEntity | null> {
    return await UserModel.findById(id).lean();
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await UserModel.updateOne({ _id: id }, { password: newPassword });
  }

  async findAll(
    data: Pagination
  ): Promise<{ users: IUserEntity[]; total: number }> {
    const { page, limit, search, status } = data;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (status === "banned") {
      query.isBanned = true;
    } else if (status === "active") {
      query.isBanned = false;
    } else if (!status || status === "all") {
      delete query.isBanned;
    }

    const [users, total] = await Promise.all([
      UserModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit).lean(),
      UserModel.countDocuments(query),
    ]);

    return { users, total };
  }

  async update(
    id: string,
    updates: Partial<IUserEntity>
  ): Promise<IUserEntity | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).lean();
  }

  async findByProviderId(
    provider: "google" | "github",
    providerId: string
  ): Promise<IUserEntity | null> {
    if (provider === "google") {
      return await UserModel.findOne({ googleId: providerId });
    } else if (provider === "github") {
      return await UserModel.findOne({ githubId: providerId });
    }
    return null;
  }

  async findBySlug(slug: string): Promise<IUserEntity | null> {
    return await UserModel.findOne({ slug }).lean();
  }

  async findBloggers(
    data: Pagination
  ): Promise<{ bloggers: IUserEntity[]; total: number }> {
    const { page, limit, search } = data;
    const skip = (page - 1) * limit;

    const searchPipeline =
      search !== ""
        ? [
            {
              $search: {
                index: "bloggers",
                text: {
                  query: search,
                  path: ["name", "slug", "headline", "bio"],
                  fuzzy: { maxEdits: 2 },
                },
              },
            },
          ]
        : [{ $match: { isBlogger: true } }];

    const [bloggers, total] = await Promise.all([
      UserModel.aggregate([
        ...searchPipeline,
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]).exec(),
      UserModel.aggregate([...searchPipeline, { $count: "total" }]).exec(),
    ]);

    return { bloggers, total: total[0]?.total || 0 };
  }
}
