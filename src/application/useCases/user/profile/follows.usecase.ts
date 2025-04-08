import { inject, injectable } from "tsyringe";
import { IFollowsUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/follows.usecase.interface";
import { IFollowsRepository } from "../../../../domain/interfaces/repositoryInterface/user/follows.repository.interface";
import { HTTP_STATUS } from "../../../../shared/constants/status-codes";
import { ResponseDto } from "../../../../shared/dtos/response.types";
import { BaseError } from "../../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../../shared/constants/error-msg";

@injectable()
export class FollowsUseCase implements IFollowsUseCase {
  constructor(
    @inject("IFollowsRepository") private followRepository: IFollowsRepository
  ) {}

  async execute(
    followerId: string,
    followingId: string,
    action: "follow" | "unfollow"
  ): Promise<ResponseDto> {
    let result;

    if (action === "follow") {
      result = await this.followRepository.follow(followerId, followingId);
    }

    if (action === "unfollow") {
      result = await this.followRepository.unfollow(followerId, followingId);
    }

    if (result && !result[0].acknowledged && !result[1].acknowledged) {
      throw new BaseError(
        ERROR_MSG.FAILED_TO_UPDATE_FOLLOW,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    return {
      success: true,
      message: `${action} successfully`,
      status: HTTP_STATUS.OK,
    };
  }
}
