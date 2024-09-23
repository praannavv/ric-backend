import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const BlogSchema = new mongoose.Schema(
  {
    BlogId: { type: String, required: true, unique: true, default: uuidv4 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
