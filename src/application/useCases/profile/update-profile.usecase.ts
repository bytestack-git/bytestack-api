import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { IUpdateProfileUseCase } from "../../../domain/interfaces/usecaseInterface/profile/update-profile.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/profile/user.repository.interface";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { BaseError } from "../../../domain/errors/base.error";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import {
  updateProfileSchema,
  UpdateProfileDTO,
} from "../../../shared/validation/schemas";
import { ZodError } from "zod";
import { IFileUploadService } from "../../../domain/interfaces/serviceInterface/file-upload/file-upload.service.interface";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IFileUploadService") private s3Service: IFileUploadService
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
    let validatedData: UpdateProfileDTO;

    try {
      validatedData = updateProfileSchema.parse(data);
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

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BaseError(
        ERROR_MSG.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    if (data.avatar && user.avatar) {
      const oldKey = user.avatar.split("/").slice(-3).join("/");
      await this.s3Service.deleteObject(oldKey);
    }

    const updatedData = await this.userRepository.update(userId, validatedData);

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.PROFILE_UPDATED,
      success: true,
      data: updatedData,
    };
  }
}
