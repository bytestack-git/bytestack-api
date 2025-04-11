import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { IGetBloggersUseCase } from "../../../domain/interfaces/usecaseInterface/profile/get-bloggers.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/profile/user.repository.interface";
import { Pagination } from "../../../shared/dtos/pagination.dto";

@injectable()
export class GetBloggersUseCase implements IGetBloggersUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(
    user: string,
    data: Pagination
  ): Promise<{ bloggers: Partial<IUserEntity>[] | null; total: number }> {
    const { bloggers, total } = await this.userRepository.findBloggers(
      user,
      data
    );

    return {
      bloggers,
      total,
    };
  }
}
