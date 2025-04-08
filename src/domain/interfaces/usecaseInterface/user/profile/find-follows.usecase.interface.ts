import { IUserEntity } from "../../../../entities/models/user.entity";

export interface IFindFollowsUseCase {
  execute(
    id: string,
    type: "followers" | "followings"
  ): Promise<Partial<IUserEntity>[] | null>;
}
