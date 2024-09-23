import Product from "../models/Product.model.js";
import { v4 as uuidv4 } from "uuid";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageURL } = req.body;

 
    // Validate required fields
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ error: "Name, Price, and Category are required" });
    }
    if (!imageURL) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Create a new product with the provided image URL
    const newProduct = new Product({
      ProductID: uuidv4(), // Generate unique ProductID
      Name: name,
      Description: description || "",
      Price: price,
      Stock: stock,
      Category: category,
      ImageURL: imageURL, // URL of the uploaded image
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;  // Extract the product ID from the request params
    console.log("Received Product ID for deletion:", productId);

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Correct the query to specify the _id field
    const product = await Product.findOneAndDelete({ _id: productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ error: "Error deleting product" });
  }
};

export const getProduct = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Respond with the list of products
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // This is the ProductID from the URL
    const { name, description, price, category, stock, imageURL } = req.body;

    // Debugging log
    console.log("ProductID received:", id);

    // Update the product by ProductID
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id }, // Match using ProductID, not _id
      {
        Name: name,
        Description: description,
        Price: price,
        Category: category,
        Stock: stock,
        ImageURL: imageURL,
      },
      { new: true, runValidators: true } // Return the updated product
    );
    console.log("about to done");
    console.log(updatedProduct);
    // If no product was found, return 404
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("herre");

    // Return success response with updated product
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};
