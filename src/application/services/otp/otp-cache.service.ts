import { injectable } from "tsyringe";
import { IOTPCacheService } from "../../../domain/interfaces/serviceInterface/otp/otp-cache.service.interface";
import { getRedisClient } from "../../../infrastructure/database/redis/init";

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
    const client = await this.getClient();
    await this.deleteOTP(email);

    const otpData = {
      otp,
      email,
      expiresAt: Date.now() + ttlSeconds * 1000,
    };

    await client.setEx(email, ttlSeconds, JSON.stringify(otpData));
  }

  async getOTP(
    email: string
  ): Promise<{ otp: string; email: string; expiresAt: number } | null> {
    const client = await this.getClient();
    const storedData = await client.get(email);

    if (!storedData) {
      return null;
    }

    const otpData = JSON.parse(storedData);

    return otpData;
  }

  async deleteOTP(email: string): Promise<void> {
    const client = await this.getClient();
    await client.del(email);
  }
}
