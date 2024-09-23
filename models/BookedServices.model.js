import mongoose from "mongoose";


const bookedServiceSchema = new mongoose.Schema({
  ServiceBookedID: {
    type: String,
    required: true,
    unique: true,
  },
  ServiceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  BookingDate: {
    type: Date,
    default: Date.now,
  },
  ScheduledDate: {
    type: Date,
    required: false,
  },
  Status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  TotalPrice: {
    type: Number,
    required: true,
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
});

const BookedService = mongoose.model("BookedService", bookedServiceSchema);

export default BookedService;
