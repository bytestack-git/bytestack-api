import mongoose, { PipelineStage } from "mongoose";
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchStage: Record<string, any> = {};

    if (status === "banned") {
      matchStage.isBanned = true;
    } else if (status === "active") {
      matchStage.isBanned = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [];

    if (search) {
      pipeline.push({
        $search: {
          index: "bloggers",
          text: {
            query: search,
            path: ["name", "slug", "headline", "bio"],
            fuzzy: { maxEdits: 1 },
          },
        },
      });
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });

    pipeline.push({
      $project: {
        name: 1,
        email: 1,
        isBlogger: 1,
        slug: 1,
        isSubscribed: 1,
        isBanned: 1,
      },
    });

    pipeline.push({ $sort: { _id: -1 } }, { $skip: skip }, { $limit: limit });

    const [users, countResult] = await Promise.all([
      UserModel.aggregate(pipeline),
      UserModel.aggregate(countPipeline),
    ]);

    const total = countResult.length > 0 ? countResult[0].total : 0;

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
    user: string,
    data: Pagination
  ): Promise<{ bloggers: IUserEntity[]; total: number }> {
    const { page, limit, search } = data;
    const skip = (page - 1) * limit;

    const blogger: PipelineStage = {
      $project: {
        name: 1,
        email: 1,
        headline: 1,
        bio: 1,
        avatar: 1,
        slug: 1,
        isBlogger: 1,
      },
    };

    const objectId = new mongoose.Types.ObjectId(user);

    const followStatsStage: PipelineStage[] = [
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "user",
          as: "followData",
        },
      },
      {
        $addFields: {
          followers: {
            $size: {
              $ifNull: [{ $arrayElemAt: ["$followData.followers", 0] }, []],
            },
          },
          isFollowed: {
            $in: [
              objectId,
              {
                $ifNull: [{ $arrayElemAt: ["$followData.followers", 0] }, []],
              },
            ],
          },
          isFollower: {
            $in: [
              objectId,
              {
                $ifNull: [{ $arrayElemAt: ["$followData.followings", 0] }, []],
              },
            ],
          },
        },
      },

      {
        $project: {
          followData: 0,
        },
      },
    ];

    const basePipeline: PipelineStage[] =
      search !== ""
        ? [
            {
              $search: {
                index: "bloggers",
                compound: {
                  should: [
                    {
                      text: {
                        query: search,
                        path: "name",
                        fuzzy: { maxEdits: 1 },
                        score: { boost: { value: 10 } },
                      },
                    },
                    {
                      text: {
                        query: search,
                        path: "slug",
                        fuzzy: { maxEdits: 1 },
                        score: { boost: { value: 8 } },
                      },
                    },
                    {
                      text: {
                        query: search,
                        path: "headline",
                        fuzzy: { maxEdits: 1 },
                        score: { boost: { value: 5 } },
                      },
                    },
                    {
                      text: {
                        query: search,
                        path: "bio",
                        fuzzy: { maxEdits: 1 },
                        score: { boost: { value: 1 } },
                      },
                    },
                  ],
                  minimumShouldMatch: 1,
                },
              },
            },
            { $match: { _id: { $ne: objectId } } },
            {
              $addFields: {
                score: { $meta: "searchScore" },
              },
            },
            {
              $sort: {
                score: -1,
              },
            },
            blogger,
            ...followStatsStage,
          ]
        : [
            { $match: { _id: { $ne: objectId }, isBlogger: true } },
            blogger,
            ...followStatsStage,
            { $sort: { followers: -1, _id: -1 } },
          ];

    const [bloggers, total] = await Promise.all([
      UserModel.aggregate([
        ...basePipeline,
        { $skip: skip },
        { $limit: limit },
      ]).exec(),
      UserModel.aggregate([...basePipeline, { $count: "total" }]).exec(),
    ]);
    return { bloggers, total: total[0]?.total || 0 };
  }
}
