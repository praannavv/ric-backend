import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { addService, deleteService, getService, updateService } from "../controller/service.controller.js";
const router = express.Router();

const logMiddleware = (req, res, next) => {
    console.log("Request received:", req.method, req.path);
    next(); // Pass control to the next middleware function or route handler
  };
router.post("/",logMiddleware, isAuthenticated, isAdmin, addService);
router.put("/:id",logMiddleware, isAuthenticated, isAdmin, updateService);
router.delete("/:id", isAuthenticated, isAdmin, deleteService);
router.get("/",getService)

export default router;
