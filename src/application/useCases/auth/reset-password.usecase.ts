import { injectable, inject } from "tsyringe";
import { IResetPasswordUseCase } from "../../../domain/interfaces/usecaseInterface/auth/reset-password.usecase.interface";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import {
  resetPasswordSchema,
  ResetPasswordDTO,
} from "../../../shared/validation/schemas";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { IOTPVerificationService } from "../../../domain/interfaces/serviceInterface/otp/otp-verification.service.interface";

@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IOTPCacheService") private otpCacheService: IOTPCacheService,
    @inject("IOTPVerificationService")
    private otpVerificationService: IOTPVerificationService
  ) {}

  async execute(
    data: ResetPasswordDTO
  ): Promise<{ status: number; message: string; success: boolean }> {
    resetPasswordSchema.parse(data);
    const { email, otp, newPassword } = data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error(ERROR_MSG.EMAIL_NOT_FOUND);

    const otpData = await this.otpCacheService.getOTP(email);

    if (!otpData) throw new Error(ERROR_MSG.OTP_EXPIRED);

    const isOTPValid = this.otpVerificationService.verifyOTP(email, otp);

    if (!isOTPValid) throw new Error(ERROR_MSG.INVALID_OTP);

    await this.userRepository.updatePassword(email, newPassword);

    return {
      status: 200,
      message: "Password reset successfully",
      success: true,
    };
  }
}
