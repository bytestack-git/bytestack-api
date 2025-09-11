import { Pagination } from "../../../../shared/dtos/pagination.dto";
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

  findFollowers(
    id: string,
    data: Pagination
  ): Promise<Partial<IUserEntity>[] | null>;

  findFollowing(
    id: string,
    data: Pagination
  ): Promise<Partial<IUserEntity>[] | null>;

  findCount(
    targetUserId: string,
    currentUserId: string
  ): Promise<{
    followers: number;
    following: number;
    isFollowing: boolean;
    isFollower: boolean;
    
  }>;
}

