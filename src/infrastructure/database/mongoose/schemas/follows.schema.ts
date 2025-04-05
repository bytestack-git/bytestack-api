import { Schema } from "mongoose";
import { IFollowsEntity } from "../../../../domain/entities/models/follows.entity";

export const FollowSchema = new Schema<IFollowsEntity>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);
