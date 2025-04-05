import { Schema } from "mongoose";
import { IFollowsEntity } from "../../../../domain/entities/models/follows.entity";

export const FollowSchema = new Schema<IFollowsEntity>(
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
