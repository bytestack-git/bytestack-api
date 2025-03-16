export interface IOTPService {
  generateOTP(): string;
  verifyOTP(email: string, inputOTP: string): Promise<boolean>;
  storeOTP(email: string, otp: string, ttlSeconds: number): Promise<void>;
  getOTP(
    email: string
  ): Promise<{ otp: string; email: string; expiresAt: number } | null>;
  deleteOTP(email: string): Promise<void>;
}
