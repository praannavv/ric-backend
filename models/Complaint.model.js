import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    ComplaintID: {
      type: String,
      required: true,
      unique: true,
    },
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    Description: {
      type: String,
      required: true,
    },
    SubmissionDate: {
      type: Date,
      default: Date.now,
    },
    ResolutionDate: {
      type: Date,
    },
    AssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
