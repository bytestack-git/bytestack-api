export interface IOTPCacheService {
  storeOTP(email: string, otp: string, ttlSeconds: number): Promise<void>;
  getOTP(
    email: string
  ): Promise<{ otp: string; email: string; expiresAt: number } | null>;
  deleteOTP(email: string): Promise<void>;
}
