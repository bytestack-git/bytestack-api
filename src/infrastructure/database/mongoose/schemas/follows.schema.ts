import { Schema } from "mongoose";
import { IFollowsModel } from "../models/follows.model";

export const FollowSchema = new Schema<IFollowsModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);
