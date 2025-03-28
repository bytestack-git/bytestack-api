import { Schema } from "mongoose";
import { IUserModel } from "../models/user.model";

export const UserSchema = new Schema<IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    headline: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    links: {
      type: [String],
      default: [],
    },
    isBlogger: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subType: {
      type: String,
      enum: ["trial", "monthly", "yearly", null],
      default: null,
    },
    subEndDate: {
      type: Date,
      default: null,
    },
    trialEndDate: {
      type: Date,
      default: null,
    },
    followedTopics: {
      type: [String],
      default: [],
    },
    techInterests: {
      type: [String],
      default: [],
    },
    searchHistory: {
      type: [String],
      default: [],
    },
    lastLogin: {
      type: Date,
      required: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
