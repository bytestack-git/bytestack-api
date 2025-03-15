import { IUserEntity } from "../../../entities/models/user.entity";

export interface IUserRepository {
  save(user: IUserEntity): Promise<IUserEntity>;
  findByEmail(email: string): Promise<IUserEntity | null>;
  findById(id: string): Promise<IUserEntity | null>;
}
