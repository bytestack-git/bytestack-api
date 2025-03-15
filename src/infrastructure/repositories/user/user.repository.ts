import { IUserEntity } from "../../../domain/entities/models/user.entity";
import { IUserRepository } from "../../../domain/interfaces/repositoryInterface/auth/user.repository.interface";
import { UserModel } from "../../database/mongoose/models/user.model";

export class UserRepository implements IUserRepository {
  async save(user: IUserEntity): Promise<IUserEntity> {
    return await UserModel.create(user);
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    return await UserModel.findOne({ email }).lean();
  }

  async findById(id: string): Promise<IUserEntity | null> {
    return await UserModel.findById(id).lean();
  }
}
