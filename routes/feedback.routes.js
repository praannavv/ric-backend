import { isAuthenticated } from "../middleware/isAuthenticated.js";
import express from "express";
import {
  getFeedback,
  postFeedback,
} from "../controller/feedback.controller.js";
const router = express.Router();

router.get("/", isAuthenticated, getFeedback);
router.post("/", isAuthenticated, postFeedback);

export default router;
