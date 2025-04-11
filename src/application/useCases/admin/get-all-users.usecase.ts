import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { IGetAllUsersUsecase } from "../../../domain/interfaces/usecaseInterface/admin/get-all-users.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/profile/user.repository.interface";
import { Pagination } from "../../../shared/dtos/pagination.dto";

@injectable()
export class GetAllUsersUsecase implements IGetAllUsersUsecase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(
    pagination: Pagination
  ): Promise<{ users: IUserEntity[] | null; total: number }> {
    const { users, total } = await this.userRepository.findAll(pagination);

    // Handle case where no users are found
    if (!users || users.length === 0) {
      return { users: null, total: 0 };
    }

    return { users, total };
  }
}
