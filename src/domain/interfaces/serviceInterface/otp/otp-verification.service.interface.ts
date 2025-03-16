export interface IOTPVerificationService {
  verifyOTP(email: string, inputOTP: string): Promise<boolean>;
}
