import { model, ObjectId } from "mongoose";
import { IFollowsEntity } from "../../../../domain/entities/models/follows.entity";
import { FollowSchema } from "../schemas/follows.schema";

export interface IFollowsModel extends Omit<IFollowsEntity, "_id">, Document {
  _id: ObjectId;
}

export const FollowModel = model<IFollowsModel>("follows", FollowSchema);
