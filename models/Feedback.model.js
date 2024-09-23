import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    FeedbackID: {
      type: String,
      required: true,
      unique: true,
    },
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Content: {
      type: String,
      required: true,
    },
    Reply: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
