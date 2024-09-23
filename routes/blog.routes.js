import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  addBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
  updateBlog,
} from "../controller/blog.controller.js";

const router = express.Router();

// Middleware for logging requests
const logMiddleware = (req, res, next) => {
  console.log("Request received:", req.method, req.path);
  console.log("blog here");
  next(); // Pass control to the next middleware function or route handler
};

// Routes for managing blogs
router.post("/", logMiddleware, isAuthenticated, isAdmin, addBlog); // Create a new blog
router.put("/:id", logMiddleware, isAuthenticated, isAdmin, updateBlog); // Update a blog by ID
router.delete("/:id", logMiddleware, isAuthenticated, isAdmin, deleteBlog); // Delete a blog by ID
router.get("/", logMiddleware, getBlogs); // Get all blogs
router.get("/:id", logMiddleware, getBlogById); // Get a blog by ID

export default router;
