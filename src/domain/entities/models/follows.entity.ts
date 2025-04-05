import { ObjectId } from "mongoose";

export interface IFollowsEntity {
  _id: ObjectId;
  user: ObjectId;
  followers: ObjectId[];
  followings: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
