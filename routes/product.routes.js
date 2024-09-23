import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../controller/product.controller.js";
const router = express.Router();

const logMiddleware = (req, res, next) => {
  console.log("Request received:", req.method, req.path);
  next(); // Pass control to the next middleware function or route handler
};

const logMiddlewaree = (req, res, next) => {
  console.log("delete product here");
  console.log("Request received:", req.method, req.path);
  next(); // Pass control to the next middleware function or route handler
};

router.post("/", logMiddleware, isAuthenticated, isAdmin, addProduct);
router.put("/:id", logMiddleware, isAuthenticated, isAdmin, updateProduct);
router.delete("/:id", logMiddlewaree, isAuthenticated, isAdmin, deleteProduct);
router.get("/", getProduct);

export default router;
