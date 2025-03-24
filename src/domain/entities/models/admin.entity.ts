import { ObjectId } from "mongoose";

export interface IAdminEntity {
  _id?: ObjectId;
  email: string;
  password: string;
  mfaSecret: string | null;
  mfaEnabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}
