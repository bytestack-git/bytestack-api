export interface IRefreshTokenUseCase {
  execute(
    refreshToken: string
  ): Promise<{
    status: number;
    message: string;
    success: boolean;
    accessToken: string;
  }>;
}
