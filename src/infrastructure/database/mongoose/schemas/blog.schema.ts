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
      required: false,
      trim: true,
    },
    metaDescription: {
      type: String,
      required: false,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    topics: {
      type: [String],
      required: true,
      default: [],
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
    isPremium: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "hidden"],
      required: true,
      default: "draft",
    },
    readTime: {
      type: String,
      required: false,
    },
    viewCount: {
      type: Number,
      required: true,
      default: 0,
    },
    likeCount: {
      type: Number,
      required: true,
      default: 0,
    },
    publishedAt: {
      type: Date,
      required: false,
    },
    isHidden: {
      type: Boolean,
      required: true,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
