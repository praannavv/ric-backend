import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    AnnouncementID: {
      type: String,
      required: true,
      unique: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Content: {
      type: String,
      required: true,
    },
    Type: {
      type: String,
      enum: ["Technology Update", "Offer", "IT Service", "Other"],
      required: true,
    },
    ImageURL: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
