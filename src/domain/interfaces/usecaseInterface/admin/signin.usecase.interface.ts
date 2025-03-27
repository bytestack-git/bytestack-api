import { LoginDTO } from "../../../../shared/validation/schemas";

export interface IAdminSigninUseCase {
  execute(data: LoginDTO): Promise<{
    status: number;
    message: string;
    success: boolean;
    admin: { id: string; email: string };
    accessToken: string;
    refreshToken: string;
  }>;
}
