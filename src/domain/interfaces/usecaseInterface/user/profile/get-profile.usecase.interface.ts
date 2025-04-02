import { IUserEntity } from "../../../../entities/models/user.entity";

export interface IGetProfileUseCase {
  execute(slug: string): Promise<{
    status: number;
    success: boolean;
    user?: Partial<IUserEntity | null>;
  }>;
}
