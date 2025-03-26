import { IUserEntity } from "../../../entities/models/user.entity";

export interface IUpdateUserUsecase {
  execute(
    userId: string,
    data: { isBanned?: boolean;}
  ): Promise<IUserEntity | null>;
}
