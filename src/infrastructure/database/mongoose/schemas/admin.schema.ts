import { Schema } from "mongoose";
import { IAdminModel } from "../models/admin.model";

export const AdminSchema = new Schema<IAdminModel>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    mfaSecret: {
      type: String,
      default: null,
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
