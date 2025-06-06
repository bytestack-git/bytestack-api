/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../../../domain/entities/models/user.entity";
import { IGetProfileUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/get-profile.usecase.interface";
import { IUserRepository } from "../../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { BaseError } from "../../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../../shared/constants/status-codes";
import { IFollowsRepository } from "../../../../domain/interfaces/repositoryInterface/user/follows.repository.interface";

@injectable()
export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IFollowsRepository") private followsRepository: IFollowsRepository
  ) {}

  async execute(
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
  }> {
    const user = await this.userRepository.findBySlug(slug);

    if (!user) {
      throw new BaseError(
        ERROR_MSG.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    if (!user?._id) {
      throw new BaseError(
        ERROR_MSG.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }
    const { followers, following, isFollowing, isFollower } =
      await this.followsRepository.findCount(user?._id.toString(), userId);

    const {
      password,
      isBanned,
      githubId,
      googleId,
      isSubscribed,
      subType,
      lastLogin,
      searchHistory,
      trialEndDate,
      updatedAt,
      ...userData
    } = user;

    return {
      status: HTTP_STATUS.OK,
      success: true,
      user: userData,
      followers,
      following,
      isFollowing,
      isFollower,
    };
  }
}
