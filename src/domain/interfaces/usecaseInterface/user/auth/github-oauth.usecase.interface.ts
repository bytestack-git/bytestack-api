import { IUserEntity } from "../../../../entities/models/user.entity";

export interface IGitHubOAuthLoginUseCase {
  execute(code: string): Promise<{
    status: number;
    message: string;
    success: boolean;
    user: Partial<IUserEntity>;
    tokens: { accessToken: string; refreshToken: string };
  }>;
}
