import { inject, injectable } from "tsyringe";
import { IFollowUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/follows.usecase.interface";
import { IFollowsRepository } from "../../../../domain/interfaces/repositoryInterface/user/follows.repository.interface";
import { HTTP_STATUS } from "../../../../shared/constants/status-codes";
import { ResponseDto } from "../../../../shared/dtos/response.types";

@injectable()
export class FollowUseCase implements IFollowUseCase {
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

    console.log(result);

    return {
      success: true,
      message: `${action} successfully`,
      status: HTTP_STATUS.OK,
    };
  }
}
