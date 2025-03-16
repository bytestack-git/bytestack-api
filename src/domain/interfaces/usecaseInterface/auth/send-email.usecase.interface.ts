export interface ISendEmailUseCase {
  execute(
    email: string,
    type: "otp" | "forgot-password" | "resend-otp"
  ): Promise<{ status: number; message: string; success: boolean }>;
}
