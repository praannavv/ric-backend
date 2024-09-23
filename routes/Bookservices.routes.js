import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  addBookedService,
  deleteBookedService,
  getBookedService,
  getAllBookedServices,
  updateBookedService,
} from "../controller/BookedService.controller.js";

const router = express.Router();

// Middleware to log requests
const logMiddleware = (req, res, next) => {
  console.log("Request received:", req.method, req.path);
  console.log("Handling booked service request");
  next(); 
};

// Routes
router.post("/", logMiddleware, isAuthenticated, addBookedService); // Add a new booked service
router.put("/:bookedServiceID", logMiddleware, isAuthenticated, updateBookedService); // Update a booked service
router.delete("/:bookedServiceID", logMiddleware, isAuthenticated, isAdmin, deleteBookedService); // Delete a booked service
router.get("/:bookedServiceID", logMiddleware, isAuthenticated, getBookedService); // Get a single booked service
router.get("/", logMiddleware, isAuthenticated, isAdmin, getAllBookedServices); // Get all booked services

export default router;
