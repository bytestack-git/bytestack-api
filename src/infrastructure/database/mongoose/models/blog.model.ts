import { model, ObjectId } from "mongoose";
import { BlogSchema } from "../schemas/blog.schema";
import { IBlogEntity } from "../../../../domain/entities/models/blog.entity";

export interface IBlogModel extends Omit<IBlogEntity, "_id">, Document {
    _id: ObjectId;
}

export const BlogModel = model<IBlogModel>("blogs", BlogSchema)