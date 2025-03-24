export interface IAdminLogoutUseCase {
    execute(
      accessToken: string
    ): Promise<{ status: number; message: string; success: boolean }>;
  }
  