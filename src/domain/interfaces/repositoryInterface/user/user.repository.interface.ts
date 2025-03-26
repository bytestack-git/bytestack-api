import { Pagination } from "../../../../shared/dtos/pagination.dto";
import { IUserEntity } from "../../../entities/models/user.entity";

export interface IUserRepository {
  save(user: IUserEntity): Promise<IUserEntity>;
  findByEmail(email: string): Promise<IUserEntity | null>;
  findById(id: string): Promise<IUserEntity | null>;
  updatePassword(email: string, newPassword: string): Promise<void>;
  findAll(data: Pagination): Promise<{ users: IUserEntity[]; total: number }>;
  update(id: string, updates: Partial<IUserEntity>): Promise<IUserEntity | null>;
}
