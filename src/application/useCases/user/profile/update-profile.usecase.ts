import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../../../domain/entities/models/user.entity";
import { IUpdateProfileUseCase } from "../../../../domain/interfaces/usecaseInterface/user/profile/update-profile.usecase.interface";
import { IUserRepository } from "../../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { HTTP_STATUS } from "../../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../../shared/constants/success-msg";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository
  ) {}
  async execute(
    userId: string,
    data: Partial<IUserEntity>
  ): Promise<{
    status: number;
    message: string;
    success: boolean;
    data: IUserEntity | null;
  }> {
    const updatedData = await this.userRepository.update(userId, data);
    console.log("updated profile",updatedData);

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.PROFILE_UPDATED,
      success: true,
      data: updatedData,
    };
  }
}
