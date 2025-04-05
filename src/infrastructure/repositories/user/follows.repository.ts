import { UpdateWriteOpResult } from "mongoose";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { IFollowsRepository } from "../../../domain/interfaces/repositoryInterface/user/follows.repository.interface";
import { FollowModel } from "../../database/mongoose/models/follows.model";

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
        { $pull: { followings: followingId } },
        { upsert: true }
      ),
      FollowModel.updateOne(
        { userId: followingId },
        { $pull: { followers: followerId } },
        { upsert: true }
      ),
    ]);
  }

  async findFollowers(id: string): Promise<Partial<IUserEntity>[] | null> {
    const followDoc = await FollowModel.findOne({ user: id }).populate({
      path: "followers",
      select: "name avatar slug _id",
    });
    return followDoc ? (followDoc.followers as Partial<IUserEntity>[]) : null;
  }

  async findFollowing(id: string): Promise<Partial<IUserEntity>[] | null> {
    const followDoc = await FollowModel.findOne({ user: id }).populate({
      path: "followings",
      select: "name, avatar slug _id",
    });

    return followDoc ? (followDoc.followings as Partial<IUserEntity>[]) : null;
  }

  async findCount(
    id: string
  ): Promise<{ followers: number; following: number }> {
    const result = await FollowModel.aggregate([
      { $match: { user: id } },
      {
        $project: {
          _id: 0,
          followers: { $size: { $ifNull: ["$followers", []] } },
          following: { $size: { $ifNull: ["$followings", []] } },
        },
      },
    ]);

    return result[0] || { followers: 0, following: 0 };
  }
}
