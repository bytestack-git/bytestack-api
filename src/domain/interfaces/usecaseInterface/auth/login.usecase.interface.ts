import { LoginDTO } from "../../../../shared/validation/schemas";

export interface ILoginUseCase {
  execute(
    data: LoginDTO
  ): Promise<{
    status: number;
    message: string;
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
  }>;
}
