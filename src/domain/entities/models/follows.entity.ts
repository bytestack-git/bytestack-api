import { ObjectId } from "mongoose";

export interface IFollowsEntity {
  _id: ObjectId;
  user: ObjectId;
  follower: ObjectId[];
  following: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
