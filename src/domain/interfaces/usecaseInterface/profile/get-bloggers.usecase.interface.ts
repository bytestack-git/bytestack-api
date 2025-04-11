import { Pagination } from "../../../../../shared/dtos/pagination.dto";
import { IUserEntity } from "../../../../entities/models/user.entity";

export interface IGetBloggersUseCase {
  execute(
    user: string,
    data: Pagination
  ): Promise<{ bloggers: Partial<IUserEntity>[] | null; total: number }>;
}
