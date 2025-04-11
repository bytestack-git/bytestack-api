import { ObjectId } from "mongoose";

export interface IBlogEntity {
  _id: string;
  userId: ObjectId;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  topics: string[];
  tags: string[];
  isPremium: boolean;
  status: "draft" | "published" | "hidden";
  readTime?: string;
  viewCount: number;
  likeCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isHidden: boolean;
  isFeatured: boolean;
}
