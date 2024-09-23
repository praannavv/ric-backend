import express from "express";
import {  isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { addOrder, deleteOrder, getOrder, getAllOrders, updateOrder } from "../controller/order.controller.js";

const router = express.Router();
const logMiddleware = (req, res, next) => {
    console.log("Request received:", req.method, req.path);
    console.log("order here");
    next(); 
  };

router.post("/", logMiddleware, addOrder);
router.put("/:orderID", logMiddleware, isAuthenticated, updateOrder);
router.delete("/:orderID", logMiddleware, isAuthenticated, isAdmin, deleteOrder);
router.get("/:orderID", logMiddleware, isAuthenticated, getOrder);
router.get("/", logMiddleware, isAuthenticated, isAdmin, getAllOrders);

export default router;
