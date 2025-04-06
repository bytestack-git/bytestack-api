import { ResponseDto } from "../../../../../shared/dtos/response.types";

export interface IFollowUseCase {
  execute(
    followerId: string,
    followingId: string,
    action: "follow" | "unfollow"
  ): Promise<ResponseDto>;
}
