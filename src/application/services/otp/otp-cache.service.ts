import { injectable } from "tsyringe";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { getRedisClient } from "../../../infrastructure/database/redis/init";
import { ERROR_MSG } from "../../../shared/constants/error-msg";

@injectable()
export class OTPCacheService implements IOTPCacheService {
  private async getClient() {
    return await getRedisClient();
  }

  async storeOTP(
    email: string,
    otp: string,
    ttlSeconds: number = 1
  ): Promise<void> {
    try {
      const client = await this.getClient();
      await this.deleteOTP(email);

      const otpData = {
        otp,
        email,
        expiresAt: Date.now() + ttlSeconds * 1000,
      };

      await client.setEx(email, ttlSeconds, JSON.stringify(otpData));
    } catch (error) {
      console.error("storeOTP error:", error);
      throw new Error(ERROR_MSG.REDIS_ERROR);
    }
  }

  async getOTP(
    email: string
  ): Promise<{ otp: string; email: string; expiresAt: number } | null> {
    try {
      const client = await this.getClient();
      const storedData = await client.get(email);

      if (!storedData) {
        return null;
      }

      const otpData = JSON.parse(storedData);

      if (Date.now() > otpData.expiresAt) {
        await this.deleteOTP(email);
        throw new Error(ERROR_MSG.OTP_EXPIRED);
      }

      return otpData;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ERROR_MSG.OTP_EXPIRED) {
          throw error;
        }
        console.error("getOTP error:", error);
        throw new Error(ERROR_MSG.REDIS_ERROR);
      }
      console.error("getOTP unexpected error:", error);
      throw new Error(ERROR_MSG.REDIS_ERROR);
    }
  }

  async deleteOTP(email: string): Promise<void> {
    try {
      const client = await this.getClient();
      await client.del(email);
    } catch (error) {
      console.error("deleteOTP error:", error);
      throw new Error(ERROR_MSG.REDIS_ERROR);
    }
  }
}
