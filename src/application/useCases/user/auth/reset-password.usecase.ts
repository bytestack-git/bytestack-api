import { injectable, inject } from "tsyringe";
import { IResetPasswordUseCase } from "../../../../domain/interfaces/usecaseInterface/user/auth/reset-password.usecase.interface";
import { IUserRepository } from "../../../../domain/interfaces/repositoryInterface/user/user.repository.interface";
import { ITokenService } from "../../../../domain/interfaces/serviceInterface/security/token.service.interface";
import { IHashService } from "../../../../domain/interfaces/serviceInterface/security/hash.service.interface";
import { ISendEmailUseCase } from "../../../../domain/interfaces/usecaseInterface/user/auth/send-email.usecase.interface";
import { BaseError } from "../../../../domain/errors/base.error";
import { z } from "zod";
import { HTTP_STATUS } from "../../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../../shared/constants/error-msg";
import {
  ResetPasswordDTO,
  resetPasswordSchema,
} from "../../../../shared/validation/schemas";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("ITokenService") private tokenService: ITokenService,
    @inject("IHashService") private hashService: IHashService,
    @inject("ISendEmailUseCase") private sendEmailUseCase: ISendEmailUseCase
  ) {}

  async execute(
    data: ResetPasswordDTO
  ): Promise<{ status: number; message: string; success: boolean }> {
    // Validate input using schema
    let validatedData: ResetPasswordDTO;
    try {
      validatedData = resetPasswordSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
    
    const { token, newPassword } = validatedData;

    const payload = this.tokenService.verifyToken(token, "reset");
    const userId = payload.id;

    const isBlacklisted = await this.tokenService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new BaseError(
        "This reset link has expired",
        HTTP_STATUS.UNAUTHORIZED,
        true
      );
    }
    // Fetch the user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BaseError(
        ERROR_MSG.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    if (!user?.password) {
      throw new BaseError(
        ERROR_MSG.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    // Compare the new password with the current password
    const isSamePassword = await this.hashService.compare(
      newPassword,
      user.password
    );
    if (isSamePassword) {
      throw new BaseError(
        "New password cannot be the same as the current password",
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    // Hash the new password
    const hashedPassword = await this.hashService.hash(newPassword);

    if (!user._id)
      throw new BaseError(
        ERROR_MSG.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );

    await this.userRepository.updatePassword(
      user._id.toString(),
      hashedPassword
    );

    // Invalidate all existing tokens for the user
    await this.tokenService.deleteRefreshToken(userId);

    // Blacklist the reset token to prevent reuse
    await this.tokenService.blacklistToken(
      token,
      this.tokenService.getAccessTokenExpiry()
    );

    // Send notification email
    await this.sendEmailUseCase.execute({
      email: user.email,
      type: "password-updated",
    });

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.PASSWORD_RESET_SUCCESSFUL,
      success: true,
    };
  }
}
