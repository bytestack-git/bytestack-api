export interface IForgotPasswordUseCase {
  execute(data: {
    email: string;
    type: string;
  }): Promise<{ status: number; message: string; success: boolean }>;
}
