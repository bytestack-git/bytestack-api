import { PipelineStage, UpdateWriteOpResult } from "mongoose";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { IFollowsRepository } from "../../../domain/interfaces/repositoryInterface/user/follows.repository.interface";
import { FollowModel } from "../../database/mongoose/models/follows.model";
import { Types } from "mongoose";
import { Pagination } from "../../../shared/dtos/pagination.dto";
export class FollowsRepository implements IFollowsRepository {
  async follow(
    followerId: string,
    followingId: string
  ): Promise<[UpdateWriteOpResult, UpdateWriteOpResult]> {
    return await Promise.all([
      FollowModel.updateOne(
        { user: followerId },
        { $addToSet: { followings: followingId } },
        { upsert: true }
      ),
      FollowModel.updateOne(
        { user: followingId },
        { $addToSet: { followers: followerId } },
        { upsert: true }
      ),
    ]);
  }

  async unfollow(
    followerId: string,
    followingId: string
  ): Promise<[UpdateWriteOpResult, UpdateWriteOpResult]> {
    return await Promise.all([
      FollowModel.updateOne(
        { user: followerId },
        { $pull: { followings: followingId } }
      ),
      FollowModel.updateOne(
        { user: followingId },
        { $pull: { followers: followerId } }
      ),
    ]);
  }

  async findFollowers(
    id: string,
    data: Pagination
  ): Promise<
    | Partial<
        IUserEntity & {
          isFollower: boolean;
          isFollowing: boolean;
          followersCount: number;
        }
      >[]
    | null
  > {
    const { limit, page, search } = data;
    const skip = (page - 1) * limit;
    const currentUserObjectId = new Types.ObjectId(id);

    const pipeline: PipelineStage[] = [
      { $match: { user: currentUserObjectId } },
      { $unwind: { path: "$followers", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followerDetails",
        },
      },
      {
        $unwind: { path: "$followerDetails", preserveNullAndEmptyArrays: true },
      },
      ...(search
        ? [
            {
              $match: {
                "followerDetails.name": { $regex: search, $options: "i" },
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: "follows",
          localField: "followerDetails._id",
          foreignField: "user",
          as: "followData",
        },
      },
      {
        $addFields: {
          followersCount: {
            $size: {
              $ifNull: [{ $arrayElemAt: ["$followData.followers", 0] }, []],
            },
          },
          isFollower: true,
          isFollowing: {
            $in: ["$followerDetails._id", { $ifNull: ["$followings", []] }],
          },
        },
      },
      {
        $project: {
          _id: "$followerDetails._id",
          name: "$followerDetails.name",
          avatar: "$followerDetails.avatar",
          slug: "$followerDetails.slug",
          followersCount: 1,
          isFollower: 1,
          isFollowing: 1,
        },
      },

      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const followers = await FollowModel.aggregate(pipeline).exec();

    if (!followers || followers.length === 0) {
      return null;
    }

    return followers;
  }

  async findFollowing(
    id: string,
    data: Pagination
  ): Promise<
    | Partial<
        IUserEntity & {
          isFollower: boolean;
          isFollowing: boolean;
          followersCount: number;
        }
      >[]
    | null
  > {
    const { limit, page, search } = data;
    const skip = (page - 1) * limit;
    const currentUserObjectId = new Types.ObjectId(id);

    const pipeline: PipelineStage[] = [
      { $match: { user: currentUserObjectId } },
      { $unwind: { path: "$followings", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "followings",
          foreignField: "_id",
          as: "followingDetails",
        },
      },
      {
        $unwind: {
          path: "$followingDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...(search
        ? [
            {
              $match: {
                "followingDetails.name": { $regex: search, $options: "i" },
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: "follows",
          localField: "followingDetails._id",
          foreignField: "user",
          as: "followData",
        },
      },
      {
        $addFields: {
          followersCount: {
            $size: {
              $ifNull: [{ $arrayElemAt: ["$followData.followers", 0] }, []],
            },
          },
          isFollowing: true,
          isFollower: {
            $in: ["$followingDetails._id", { $ifNull: ["$followers", []] }],
          },
        },
      },
      {
        $project: {
          _id: "$followingDetails._id",
          name: "$followingDetails.name",
          avatar: "$followingDetails.avatar",
          slug: "$followingDetails.slug",
          followersCount: 1,
          isFollower: 1,
          isFollowing: 1,
        },
      },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const followings = await FollowModel.aggregate(pipeline).exec();

    if (!followings || followings.length === 0) {
      return null;
    }

    return followings;
  }

  async findCount(
    targetUserId: string,
    currentUserId: string
  ): Promise<{
    followers: number;
    following: number;
    isFollowing: boolean;
    isFollower: boolean;
  }> {
    const result = await FollowModel.aggregate([
      {
        $match: { user: new Types.ObjectId(targetUserId) },
      },
      {
        $project: {
          _id: 0,
          followers: { $size: { $ifNull: ["$followers", []] } },
          following: { $size: { $ifNull: ["$followings", []] } },
          isFollowing: {
            $in: [
              new Types.ObjectId(currentUserId),
              { $ifNull: ["$followers", []] },
            ],
          },
          isFollower: {
            $in: [
              new Types.ObjectId(currentUserId),
              { $ifNull: ["$followings", []] },
            ],
          },
        },
      },
    ]);

    return (
      result[0] || {
        followers: 0,
        following: 0,
        isFollowing: false,
        isFollower: false,
      }
    );
  }
}
