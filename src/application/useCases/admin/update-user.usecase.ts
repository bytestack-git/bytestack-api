import { inject, injectable } from "tsyringe";
import { IUpdateUserUsecase } from "../../../domain/interfaces/usecaseInterface/admin/update-user.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { IUserEntity } from "../../../domain/entities/models/user.entity";

@injectable()
export class UpdateUserUsecase implements IUpdateUserUsecase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    data: { isBanned?: boolean }
  ): Promise<IUserEntity | null> {
    //! add zod validation here

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updateData: { isBanned?: boolean } = {};
    if (data.isBanned !== undefined) updateData.isBanned = data.isBanned;

    return await this.userRepository.update(userId, updateData);
  }
}
