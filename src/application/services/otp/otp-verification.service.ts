import { injectable, inject } from "tsyringe";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { IOTPVerificationService } from "../../../domain/interfaces/serviceInterface/otp/otp-verification.service.interface";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class OTPVerificationService implements IOTPVerificationService {
  constructor(
    @inject("IOTPCacheService") private otpCacheService: IOTPCacheService
  ) {}

  async verifyOTP(email: string, inputOTP: string): Promise<boolean> {
    // Validate inputs
    if (!email || !inputOTP) {
      throw new BaseError(
        ERROR_MSG.INVALID_DATA,
        HTTP_STATUS.BAD_REQUEST,
        true
      );
    }

    const otpData = await this.otpCacheService.getOTP(email);

    if (!otpData) {
      throw new BaseError(ERROR_MSG.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST, true);
    }

    if (Date.now() > otpData.expiresAt) {
      await this.otpCacheService.deleteOTP(email);
      throw new BaseError(ERROR_MSG.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST, true);
    }

    const isValid = inputOTP.trim() === otpData.otp.trim();

    if (!isValid) {
      throw new BaseError(ERROR_MSG.INVALID_OTP, HTTP_STATUS.BAD_REQUEST, true);
    }

    await this.otpCacheService.deleteOTP(email);

    return true;
  }
}
