import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js"; // Ensure this middleware is correctly implemented
import {
  signup,
  login,
  logout,
  getMe,
  sigupEmployee,getAllEmployees,getAllUsers
} from "../controller/auth.controller.js";
import conf from "../conf/conf.js";
import Admin from "../models/Admin.model.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout); // Apply isAuthenticated middleware to secure the logout route
router.get("/me", isAuthenticated, getMe);
router.post("/signupAdmin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Generate a unique AdminID
    const adminID = uuidv4();

    // Check if the email is already registered
    const existingAdmin = await Admin.findOne({ Email: email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new Admin instance
    const newAdmin = new Admin({
      AdminID: adminID,
      Name: name,
      Email: email,
      Password: hashedPassword,
      ManagedUsers: [], // Initialize as empty array
      ManagedEmployees: [], // Initialize as empty array
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Generate a token and set it in a cookie
    // const token = jwt.sign(
    //   { userId: newAdmin._id, role: "Admin" },
    //   conf.JWT_SECRET,
    //   {
    //     expiresIn: "5h",
    //   }
    // );

    // Set cookie
    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Set to true in production
    //   maxAge: 3600000, // 1 hour in milliseconds
    // });

    // Respond with the newly created admin details
    res.status(201).json({
      _id: newAdmin._id,
      AdminID: newAdmin.AdminID,
      Name: newAdmin.Name,
      Email: newAdmin.Email,
      ManagedUsers: newAdmin.ManagedUsers || [],
      ManagedEmployees: newAdmin.ManagedEmployees || [],
    });
  } catch (err) {
    console.error("Error in adminSignup controller:", err); // Log the full error object
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signupEmployee", isAuthenticated, isAdmin, sigupEmployee);
router.get("/employees",isAuthenticated,isAdmin,getAllEmployees)
router.get("/user",isAuthenticated,isAdmin,getAllUsers)
export default router;
