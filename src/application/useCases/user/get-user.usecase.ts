import { injectable, inject } from "tsyringe";
import { IGetUserUseCase } from "../../../domain/interfaces/usecaseInterface/user/get-user.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { BaseError } from "../../../domain/errors/base.error";

@injectable()
export class GetUserUseCase implements IGetUserUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<{
    status: number;
    message: string;
    success: boolean;
    user?: Partial<IUserEntity>;
  }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BaseError(
        ERROR_MSG.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        false
      );
    }

    const userData: Partial<IUserEntity> = {
      name: user.name,
      bio: user.bio,
      email: user.email,
      avatar: user.avatar,
      followedTopics: user.followedTopics,
      headline: user.headline,
      isBlogger: user.isBlogger,
      isSubscribed: user.isSubscribed,
      techInterests: user.techInterests,
      searchHistory: user.searchHistory,
      links: user.links,
      subEndDate: user.subEndDate,
      subType: user.subType,
      trialEndDate: user.trialEndDate,
    };

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.USER_FETCHED_SUCCESSFULLY,
      success: true,
      user: userData,
    };
  }
}
