// controller/blog.controller.js
import Blog from "../models/Blog.model.js"; // Ensure the path is correct

// Create a new blog
export const addBlog = async (req, res) => {
  try {
    const { title, content, type, image } = req.body;
    console.log("add blog here")
    const newBlog = new Blog({ title, content, type, image });
    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog" });
  }
};

// Update an existing blog by ID
export const updateBlog = async (req, res) => {
  try {
    const { title, content, author, type, detail, image } = req.body;
    const updatedBlog = await Blog.findOneAndUpdate(
      { BlogId: req.params.id },
      { title, content, author, type, detail, image },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

// Delete a blog by ID
export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({ BlogId: req.params.id });

    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    console.log("getblog");
    const blogs = await Blog.find();

    res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

// Get a blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ BlogId: req.params.id });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};
