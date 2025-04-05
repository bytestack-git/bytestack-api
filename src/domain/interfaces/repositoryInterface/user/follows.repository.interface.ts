import { IUserEntity } from "../../../entities/models/user.entity";
import { UpdateWriteOpResult } from "mongoose";

export interface IFollowsRepository {
  follow(
    followerId: string,
    followingId: string
  ): Promise<[UpdateWriteOpResult, UpdateWriteOpResult]>;
  unfollow(
    followerId: string,
    followingId: string
  ): Promise<[UpdateWriteOpResult, UpdateWriteOpResult]>;
  findFollowers(id: string): Promise<Partial<IUserEntity>[] | null>;
  findFollowing(id: string): Promise<Partial<IUserEntity>[] | null>;
  findCount(id: string): Promise<{ followers: number; following: number }>;
}
