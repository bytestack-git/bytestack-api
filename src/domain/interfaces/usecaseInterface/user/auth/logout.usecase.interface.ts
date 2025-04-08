export interface ILogoutUseCase {
  execute(
    refreshToken: string
  ): Promise<{ status: number; message: string; success: boolean }>;
}
