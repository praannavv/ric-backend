import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    OrderID: {
      type: String,
      required: true,
      unique: true,
    },
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "In Progress"],
      default: "Pending",
    },
    OrderDate: {
      type: Date,
      default: Date.now,
    },
    CompletionDate: {
      type: Date,
      required: false,
    },

    Flat: {
      type: String,
      required: true,
    },
    Street: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    State: {
      type: String,
      default: "Maharashtra",
    },
    PinCode: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      default: "India",
    },
    totalPrice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
