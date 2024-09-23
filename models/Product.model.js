import mongoose from "mongoose";

// Define the Product Schema
const productSchema = new mongoose.Schema(
  {
    ProductID: {
      type: String,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
    },
    Price: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Stock: {
      type: Number,
      required: true,
      default: 0,
    },
    ImageURL: {
      type: String, // URL of the image
    },
  },
  {
    timestamps: true,
  }
);

// Create the Product model
const Product = mongoose.model("Product", productSchema);

export default Product;
