import { IUserEntity } from "../../../entities/models/user.entity";
import { Pagination } from "../../../../shared/dtos/pagination.dto";

export interface IGetAllUsersUsecase {
  execute(
    pagination: Pagination
  ): Promise<{ users: IUserEntity[] | null; total: number }>;
}