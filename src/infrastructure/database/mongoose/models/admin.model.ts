import { model, Document, Schema } from "mongoose";
import { AdminSchema } from "../schemas/admin.schema";
import { IAdminEntity } from "../../../../domain/entities/models/admin.entity";

export interface IAdminModel extends Omit<IAdminEntity, "_id">, Document {
  _id: Schema.Types.ObjectId;
}

export const AdminModel = model<IAdminModel>("admin", AdminSchema);
