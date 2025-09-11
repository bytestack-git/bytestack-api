import { ResponseDto } from "../../../../shared/dtos/response.types";

export interface IFollowsUseCase {
  execute(
    followerId: string,
    followingId: string,
    action: "follow" | "unfollow"
  ): Promise<ResponseDto>;
}
