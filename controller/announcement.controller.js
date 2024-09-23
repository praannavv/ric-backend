import Announcement from "../models/Announcement.model.js";
import { v4 as uuidv4 } from "uuid";

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error in getAllAnnouncements controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findOne({ AnnouncementID: id });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(200).json(announcement);
  } catch (error) {
    console.error("Error in getAnnouncementById controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
  
export const postAnnouncement = async (req, res) => {
  try {
    const { Title, Content, Type, ImageURL } = req.body;

    if (!Title || !Content || !Type) {
      return res
        .status(400)
        .json({ error: "All fields are required: Title, Content, and Type" });
    }

    const AnnouncementID = uuidv4();

    const newAnnouncement = new Announcement({
      AnnouncementID,
      Title,
      Content,
      Type,
      ImageURL,
    });

    await newAnnouncement.save();

    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error("Error in postAnnouncement controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Announcement ID:", id); // Log the ID for debugging

    // Find and delete the announcement by ID
    const deletedAnnouncement = await Announcement.findOneAndDelete({
      AnnouncementID: id,
    });

    if (!deletedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAnnouncement controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
