import { injectable, inject } from "tsyringe";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { IOTPVerificationService } from "../../../domain/interfaces/serviceInterface/otp/otp-verification.service.interface";

@injectable()
export class OTPVerificationService implements IOTPVerificationService {
  constructor(
    @inject("IOTPCacheService") private otpCacheService: IOTPCacheService
  ) {}

  async verifyOTP(email: string, inputOTP: string): Promise<boolean> {
    const otpData = await this.otpCacheService.getOTP(email);

    if (!otpData) {
      throw new Error(ERROR_MSG.INVALID_OTP);
    }

    if (Date.now() > otpData.expiresAt) {
      await this.otpCacheService.deleteOTP(email);
      throw new Error(ERROR_MSG.OTP_EXPIRED);
    }

    const isValid = inputOTP.trim() === otpData.otp.trim();

    if (isValid) await this.otpCacheService.deleteOTP(email);

    if (!isValid) {
      throw new Error(ERROR_MSG.INVALID_OTP);
    }

    return true;
  }
}
