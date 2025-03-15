import { model, Document, ObjectId } from "mongoose";
import { UserSchema } from "../schemas/user.schema";
import { IUserEntity } from "../../../../domain/entities/models/user.entity";

export interface IUserModel extends Omit<IUserEntity, "_id">, Document {
  _id: ObjectId;
}

export const UserModel = model<IUserModel>("users", UserSchema);
