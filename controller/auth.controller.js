import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model.js"; // Ensure you have this model
import User from "../models/User.model.js";
import Employee from "../models/Employee.model.js"; // Ensure you have this model
import conf from "../conf/conf.js";
import { v4 as uuidv4 } from "uuid";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const userID = uuidv4();
    console.log(name, email, password);
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    console.log(name, email, password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      UserID: userID,
      Name: name,
      Email: email,
      Password: hashedPassword,
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({
      _id: newUser._id,
      UserID: newUser.UserID,
      Name: newUser.Name,
      Email: newUser.Email,
      Complaints: newUser.Complaints || [],
      Feedback: newUser.Feedback || [],
      Orders: newUser.Orders || [],
      Services: newUser.Services || [],
    });
  } catch (err) {
    console.log("Error in signup controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email, password, role);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    if (!["Admin", "User", "Employee"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    console.log(role);

    let model;
    switch (role) {
      case "Admin":
        model = Admin;
        break;
      case "User":
        model = User;
        break;
      case "Employee":
        model = Employee;
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }
    console.log("model", model);

    const user = await model.findOne({ Email: email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.Password || ""
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate token with user role
    const token = await jwt.sign({ userId: user._id, role }, conf.JWT_SECRET, {
      expiresIn: "5h", // Token expiration
    });
    console.log(token);

    // Set cookie

    console.log("Cookie set");

    // Respond with user data and role
    if (role === "User") {
      res
        .cookie("jwt", token, {
          maxAge: 15 * 24 * 60 * 60 * 1000,
          sameSite: "none",
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .json({
          _id: user._id,
          UserID: user.UserID,
          Name: user.Name,
          Email: user.Email,
          Complaints: user.Complaints || [],
          Feedback: user.Feedback || [],
          Orders: user.Orders || [],
          Services: user.Services || [],
        });
    } else if (role === "Admin") {
      res
        .cookie("jwt", token, {
          maxAge: 15 * 24 * 60 * 60 * 1000,
          sameSite: "none",
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .json({
          _id: user._id,
          AdminID: user.AdminID,
          Name: user.Name,
          Email: user.Email,
          ManagedUsers: user.ManagedUsers || [],
          ManagedEmployees: user.ManagedEmployees || [],
        });
    } else if (role === "Employee") {
      res
        .cookie("jwt", token, {
          //secure: conf.NODE_ENV !== "development",
          maxAge: 15 * 24 * 60 * 60 * 1000,
          sameSite: "none",
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .json({
          _id: user._id,
          EmployeeID: user.EmployeeID,
          Name: user.Name,
          Email: user.Email,
          Tasks: user.Tasks || [],
          AssignedComplaints: user.AssignedComplaints || [],
        });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }
  } catch (err) {
    console.log("Error in login controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  } finally {
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Error in logout controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    // Extract user ID and role from the request
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!userId || !userRole) {
      return res.status(400).json({ error: "User ID and role are required" });
    }

    // Determine the model based on the user's role
    let model;
    switch (userRole) {
      case "Admin":
        model = Admin;
        break;
      case "User":
        model = User;
        break;
      case "Employee":
        model = Employee;
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    // Find the user by their ID in the appropriate collection
    const user = await model.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user data based on the role
    if (userRole === "User") {
      res.status(200).json({
        _id: user._id,
        UserID: user.UserID,
        Name: user.Name,
        Email: user.Email,
        role: "User",
        Complaints: user.Complaints || [],
        Feedback: user.Feedback || [],
        Orders: user.Orders || [],
        Services: user.Services || [],
      });
    } else if (userRole === "Admin") {
      res.status(200).json({
        _id: user._id,
        AdminID: user.AdminID,
        Name: user.Name,
        Email: user.Email,
        role: "Admin",
        ManagedUsers: user.ManagedUsers || [],
        ManagedEmployees: user.ManagedEmployees || [],
      });
    } else if (userRole === "Employee") {
      res.status(200).json({
        _id: user._id,
        EmployeeID: user.EmployeeID,
        Name: user.Name,
        Email: user.Email,
        role: "Employee",
        Tasks: user.Tasks || [],
        AssignedComplaints: user.AssignedComplaints || [],
      });
    }
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sigupEmployee = async (req, res) => {
  console.log("singupEmployee")
  try {

    const { name, email, password } = req.body;
    console.log(name)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    console.log("here in uuid")
    // Generate a unique EmployeeID
    const employeeID = uuidv4();

    // Check if the email is already registered
    const existingEmployee = await Employee.findOne({ Email: email });
    if (existingEmployee) {
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

    // Create a new Employee instance
    const newEmployee = new Employee({
      EmployeeID: employeeID,
      Name: name,
      Email: email,
      Password: hashedPassword,
      ManagedTasks: [], // Initialize as empty array
    });

    // Save the new employee to the database
    await newEmployee.save();

    // Respond with the newly created employee details (without cookies)
    res.status(201).json({
      _id: newEmployee._id,
      EmployeeID: newEmployee.EmployeeID,
      Name: newEmployee.Name,
      Email: newEmployee.Email,
      ManagedTasks: newEmployee.ManagedTasks || [],
    });
  } catch (err) {
    console.error("Error in signupEmployee controller:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all employees from the database
    res.status(200).json({ employees }); // Send the employees in the response
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({ users }); // Send the users in the response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
