import { inject, injectable } from "tsyringe";
import { IUpdateUserUsecase } from "../../../domain/interfaces/usecaseInterface/admin/update-user.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { ICacheService } from "../../../domain/interfaces/serviceInterface/cashe/cache.service.interface";
import {
  updateUserDTO,
  updateUserSchema,
} from "../../../shared/validation/schemas";
import { BaseError } from "../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ZodError } from "zod";

@injectable()
export class UpdateUserUsecase implements IUpdateUserUsecase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("ICacheService") private cacheService: ICacheService
  ) {}

  async execute(
    userId: string,
    data: { isBanned?: boolean }
  ): Promise<IUserEntity | null> {
    let validationResult: updateUserDTO;
    try {
      validationResult = updateUserSchema.parse({ userId, data });
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BaseError(
          ERROR_MSG.INVALID_DATA,
          HTTP_STATUS.BAD_REQUEST,
          true
        );
      }
      throw new BaseError(
        "Failed to validate input data",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        false
      );
    }

    const { userId: validatedUserId, data: validatedData } = validationResult;

    const user = await this.userRepository.findById(validatedUserId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updateData: { isBanned?: boolean } = {};
    if (validatedData.isBanned !== undefined)
      updateData.isBanned = validatedData.isBanned;

    if (validatedData.isBanned !== undefined) {
      if (validatedData.isBanned === true && user.isBanned === false) {
        await this.cacheService.addBlockedUser(validatedUserId);
      } else if (validatedData.isBanned === false && user.isBanned === true) {
        await this.cacheService.removeBlockedUser(validatedUserId);
      }
    }

    return await this.userRepository.update(userId, updateData);
  }
}
