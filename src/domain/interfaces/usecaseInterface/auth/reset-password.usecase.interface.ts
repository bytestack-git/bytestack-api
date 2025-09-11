export interface IResetPasswordUseCase {
  execute(data: {
    token: string;
    newPassword: string;
  }): Promise<{ status: number; message: string; success: boolean }>;
}
