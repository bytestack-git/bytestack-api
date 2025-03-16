import { injectable } from "tsyringe";
import { IOTPService } from "../../../domain/interfaces/serviceInterface/auth/otp.service.interface";
import { getRedisClient } from "../../../infrastructure/database/redis/init";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { randomInt } from "crypto";

@injectable()
export class OTPService implements IOTPService {
  private async getClient() {
    return await getRedisClient();
  }

  generateOTP = (): string => {
    const otp = randomInt(100000, 999999);
    return otp.toString();
  };

  async storeOTP(
    email: string,
    otp: string,
    ttlSeconds: number = 180
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
      console.error('storeOTP error:', error);
      throw new Error(ERROR_MSG.REDIS_ERROR);
    }
  }

  async verifyOTP(email: string, inputOTP: string): Promise<boolean> {
    try {
      const otpData = await this.getOTP(email);

      console.log('verifyOTP otpData:', otpData);
      if (!otpData) {
        throw new Error(ERROR_MSG.INVALID_OTP);
      }

      const isValid = inputOTP.trim() === otpData.otp.trim();
      
      // Always delete OTP after verification attempt
      await this.deleteOTP(email);

      if (!isValid) {
        throw new Error(ERROR_MSG.INVALID_OTP);
      }

      return true;
    } catch (error) {
      // Type guard for error
      if (error instanceof Error) {
        if (error.message === ERROR_MSG.OTP_EXPIRED) {
          throw new Error(ERROR_MSG.OTP_EXPIRED);
        }
        if (error.message === ERROR_MSG.INVALID_OTP) {
          throw new Error(ERROR_MSG.INVALID_OTP);
        }
        console.error('verifyOTP error:', error);
        throw new Error(ERROR_MSG.REDIS_ERROR);
      }
      // Handle unexpected error types
      console.error('verifyOTP unexpected error:', error);
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
        console.error('getOTP error:', error);
        throw new Error(ERROR_MSG.REDIS_ERROR);
      }
      console.error('getOTP unexpected error:', error);
      throw new Error(ERROR_MSG.REDIS_ERROR);
    }
  }

  async deleteOTP(email: string): Promise<void> {
    try {
      const client = await this.getClient();
      await client.del(email);
    } catch (error) {
      console.error('deleteOTP error:', error);
      throw new Error(ERROR_MSG.REDIS_ERROR);
    }
  }
}