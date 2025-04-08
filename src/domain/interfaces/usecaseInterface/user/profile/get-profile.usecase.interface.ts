import { IUserEntity } from "../../../../entities/models/user.entity";

export interface IGetProfileUseCase {
  execute(
    slug: string,
    userId: string
  ): Promise<{
    status: number;
    success: boolean;
    user?: Partial<IUserEntity | null>;
    followers: number;
    following: number;
    isFollowing: boolean;
    isFollower: boolean;
  }>;
}
