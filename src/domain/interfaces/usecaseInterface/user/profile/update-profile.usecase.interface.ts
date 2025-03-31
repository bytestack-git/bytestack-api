import { IUserEntity } from "../../../../entities/models/user.entity";

export interface IUpdateProfileUseCase {
  execute(
    userId: string,
    data: Partial<IUserEntity>
  ): Promise<{
    status: number;
    message: string;
    success: boolean;
    data: IUserEntity | null;
  }>;
}
