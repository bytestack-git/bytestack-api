import { IUserEntity } from "../../../../entities/models/user.entity";

export interface IGetUserUseCase {
  execute(userId: string): Promise<{
    status: number;
    message: string;
    success: boolean;
    user?: Partial<IUserEntity>;
  }>;
}
