import { injectable, inject } from "tsyringe";
import { IResetPasswordUseCase } from "../../../domain/interfaces/usecaseInterface/auth/reset-password.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { IOTPVerificationService } from "../../../domain/interfaces/serviceInterface/otp/otp-verification.service.interface";
import { IHashService } from "../../../domain/interfaces/serviceInterface/security/hash.service.interface";
import {
  resetPasswordSchema,
  ResetPasswordDTO,
} from "../../../shared/validation/schemas";
import { BaseError } from "../../../domain/errors/base.error";
import { ZodError } from "zod";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { SUCCESS_MSG } from "../../../shared/constants/success-msg";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IOTPCacheService") private otpCacheService: IOTPCacheService,
    @inject("IOTPVerificationService")
    private otpVerificationService: IOTPVerificationService,
    @inject("IHashService") private hashService: IHashService
  ) {}

  async execute(
    data: ResetPasswordDTO
  ): Promise<{ status: number; message: string; success: boolean }> {
    // Validate input using schema
    let validatedData: ResetPasswordDTO;
    try {
      validatedData = resetPasswordSchema.parse(data);
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
    const { email, otp, newPassword } = validatedData;

    // Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BaseError(
        ERROR_MSG.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        true
      );
    }

    // Check if OTP exists
    const otpData = await this.otpCacheService.getOTP(email);
    if (!otpData) {
      throw new BaseError(ERROR_MSG.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST, true);
    }

    // Verify OTP
    await this.otpVerificationService.verifyOTP(email, otp);

    // Hash the new password
    const hashedPassword = await this.hashService.hash(newPassword);

    // Update user's password
    await this.userRepository.updatePassword(email, hashedPassword);

    return {
      status: HTTP_STATUS.OK,
      message: SUCCESS_MSG.PASSWORD_RESET_SUCCESSFUL,
      success: true,
    };
  }
}
