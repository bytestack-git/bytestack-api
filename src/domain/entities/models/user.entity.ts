import { ObjectId } from "mongoose";

export interface IUserEntity {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  headline?: string;
  bio?: string;
  avatar: string;
  links?: string[];
  isBlogger: boolean;
  isSubscribed: boolean;
  githubId?: string;
  googleId?: string;
  subType: "trial" | "monthly" | "yearly" | null;
  subEndDate: Date | null;
  trialEndDate: Date | null;
  followedTopics: string[];
  techInterests: string[];
  searchHistory: string[];
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isBanned: boolean;
}
