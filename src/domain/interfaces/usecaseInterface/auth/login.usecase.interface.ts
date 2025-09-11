import { LoginDTO } from "../../../../shared/validation/schemas";
import { IUserEntity } from "../../../entities/models/user.entity";

export interface ILoginUseCase {
  execute(data: LoginDTO): Promise<{
    status: number;
    message: string;
    success: boolean;
    user: Partial<IUserEntity>;
    tokens?: { accessToken: string; refreshToken: string };
  }>;
}
