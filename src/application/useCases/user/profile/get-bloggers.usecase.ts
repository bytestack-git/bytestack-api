import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../../../domain/entities/models/user.entity";
import { IGetBloggersUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/get-bloggers.usecase.interface";
import { Pagination } from "../../../../shared/dtos/pagination.dto";
import { IUserRepository } from "../../../../domain/interfaces/repositoryInterface/user/user.repository.interface";

@injectable()
export class GetBloggersUseCase implements IGetBloggersUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(
    data: Pagination
  ): Promise<{ bloggers: Partial<IUserEntity>[] | null; total: number }> {

    const { bloggers, total } = await this.userRepository.findBloggers(data);

    return {
      bloggers,
      total,
    };
  }
}
 