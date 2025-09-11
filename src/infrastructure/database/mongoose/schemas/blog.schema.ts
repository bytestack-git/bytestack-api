import mongoose, { Schema } from "mongoose";
import { IBlogModel } from "../models/blog.model";

export const BlogSchema = new Schema<IBlogModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      required: false,
    },
    metaDescription: {
      type: String,
      trim: true,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    topics: {
      type: [String],
      default: [],
      required: false,
    },
    tags: {
      type: [String],
      default: [],
      required: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "hidden"],
      default: "draft",
      required: true,
    },
    readTime: {
      type: String,
      required: false,
    },
    viewCount: {
      type: Number,
      default: 0,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
      required: true,
    },
    publishedAt: {
      type: Date,
      required: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

