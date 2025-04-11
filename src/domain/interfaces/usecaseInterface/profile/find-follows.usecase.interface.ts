import { Pagination } from "../../../../../shared/dtos/pagination.dto";
import { IUserEntity } from "../../../../entities/models/user.entity";

export interface IFindFollowsUseCase {
  execute(
    id: string,
    type: "followers" | "followings",
    data: Pagination
  ): Promise<Partial<IUserEntity>[] | null>;
}
