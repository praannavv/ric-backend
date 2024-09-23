import { isAuthenticated } from "../middleware/isAuthenticated.js";
import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
import {
  getAnnouncementById,
  postAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
} from "../controller/announcement.controller.js";

router.get("/:id", isAuthenticated, getAnnouncementById);
router.get("", isAuthenticated, getAllAnnouncements);
router.post("", isAuthenticated, isAdmin, postAnnouncement);
router.delete("/:id", isAuthenticated, isAdmin, deleteAnnouncement);

export default router;
