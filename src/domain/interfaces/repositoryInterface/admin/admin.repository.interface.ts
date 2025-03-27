import { IAdminEntity } from "../../../entities/models/admin.entity";

export interface IAdminRepository {
  findById(id: string): Promise<Partial<IAdminEntity> | null>;
  findByEmail(email: string): Promise<Partial<IAdminEntity> | null>;
  setupMFA(id: string, secret: string): Promise<void>;
}
