import Order from "../models/Order.model.js";
import User from "../models/User.model.js"; // Ensure correct path
import { v4 as uuidv4 } from "uuid";
import Product from "../models/Product.model.js";
import { getUser } from "../lib/helper/getUser.js";
import mongoose from "mongoose";

export const addOrder = async (req, res) => {
  try {
    // Get user and role from the helper function
    const { user, role } = await getUser(req);
    console.log(user._id);
    const { productID, flatRoomNo, streetName, pincode, city, totalPrice } =
      req.body;
    const product = await Product.findOne({ ProductID: productID });

    if (!user || !user._id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // Create new order
    const newOrder = new Order({
      OrderID: uuidv4(), // Generate unique OrderID
      ProductID: product._id, // Ensure productID is a valid ObjectId
      UserID: user._id, // Ensure user._id is a valid ObjectId
      Status: "Pending", // Ensure Status field is correct
      Flat: flatRoomNo,
      Street: streetName,
      City: city,
      PinCode: pincode,
      totalPrice: totalPrice + 50, // Make sure totalPrice field exists in your schema
    });

    // Save new order
    await newOrder.save();
    console.log(newOrder)
    // Update User's Orders array
    await User.findByIdAndUpdate(user._id, {
      $push: { Orders: newOrder._id },
    });

    // Respond with the created order
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { orderID } = req.params;

    // Validate required fields
    if (!orderID) {
      return res.status(400).json({ error: "OrderID is required" });
    }

    // Find and delete the order
    const deletedOrder = await Order.findOneAndDelete({ OrderID: orderID });

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Remove the order reference from the user's Orders array
    await User.findByIdAndUpdate(
      deletedOrder.UserID,
      { $pull: { Orders: deletedOrder._id } },
      { new: true }
    );

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Order by ID
export const getOrder = async (req, res) => {
  try {
    const { orderID } = req.params;

    // Validate required fields
    if (!orderID) {
      return res.status(400).json({ error: "OrderID is required" });
    }

    // Find the order
    const order = await Order.findOne({ OrderID: orderID })
      .populate("UserID") // Populate User details
      .populate("ProductID"); // Populate Product details

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("UserID") // Populate User details
      .populate("ProductID"); // Populate Product details

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Order
export const updateOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { userID, productID, address, status, completionDate } = req.body;

    // Validate required fields
    if (!orderID) {
      return res.status(400).json({ error: "OrderID is required" });
    }

    // Update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { OrderID: orderID },
      {
        UserID: userID,
        ProductID: productID,
        Address: address,
        Status: status,
        CompletionDate: completionDate,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
