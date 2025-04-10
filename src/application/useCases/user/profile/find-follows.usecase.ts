import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../../../domain/entities/models/user.entity";
import { IFindFollowsUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/find-follows.usecase.interface";
import { IFollowsRepository } from "../../../../domain/interfaces/repositoryInterface/user/follows.repository.interface";
import { Pagination } from "../../../../shared/dtos/pagination.dto";

@injectable()
export class FindFollowsUseCase implements IFindFollowsUseCase {
  constructor(
    @inject("IFollowsRepository")
    private findFollowsRepository: IFollowsRepository
  ) {}

  async execute(
    id: string,
    type: "followers" | "followings",
    data: Pagination
  ): Promise<Partial<IUserEntity>[] | null> {
    let result: Partial<IUserEntity>[] | null = null;

    if (type === "followers") {
      result = await this.findFollowsRepository.findFollowers(id, data);
    }

    if (type === "followings") {
      result = await this.findFollowsRepository.findFollowing(id, data);
    }

    return result;
  }
}
