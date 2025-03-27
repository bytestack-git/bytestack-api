export interface IRefreshTokenUseCase {
  execute(
    refreshToken: string,
    expectedRole?: "admin" | "user"
  ): Promise<{
    status: number;
    message: string;
    success: boolean;
    accessToken: string;
  }>;
}
