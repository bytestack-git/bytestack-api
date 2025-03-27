import { injectable } from "tsyringe";
import { IAdminRepository } from "../../../domain/interfaces/repositoryInterface/admin/admin.repository.interface";
import { AdminModel } from "../../database/mongoose/models/admin.model";
import { BaseError } from "../../../domain/errors/base.error";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ERROR_MSG } from "../../../shared/constants/error-msg";
import { IAdminEntity } from "../../../domain/entities/models/admin.entity";

@injectable()
export class AdminRepository implements IAdminRepository {
  async findById(id: string): Promise<Partial<IAdminEntity> | null> {
    const admin = await AdminModel.findById(id)
      .select("_id email password mfaSecret mfaEnabled")
      .lean();
    if (!admin) return null;
    return {
      _id: admin._id,
      email: admin.email,
      password: admin.password,
      mfaSecret: admin.mfaSecret,
      mfaEnabled: admin.mfaEnabled,
    };
  }

  async findByEmail(email: string): Promise<Partial<IAdminEntity> | null> {
    const admin = await AdminModel.findOne({ email })
      .select("_id email password mfaSecret mfaEnabled")
      .lean();
    if (!admin) return null;
    return {
      _id: admin._id,
      email: admin.email,
      password: admin.password,
      mfaSecret: admin.mfaSecret,
      mfaEnabled: admin.mfaEnabled,
    };
  }

  async setupMFA(id: string, secret: string): Promise<void> {
    const admin = await AdminModel.findById(id);
    if (!admin) {
      throw new BaseError(ERROR_MSG.NOT_FOUND, HTTP_STATUS.NOT_FOUND, true);
    }
    await AdminModel.updateOne(
      { _id: id },
      { mfaSecret: secret, mfaEnabled: true }
    );
  }
}
