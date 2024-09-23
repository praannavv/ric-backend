import conf from "../conf/conf.js";
import User from "../models/User.model.js";
import Admin from "../models/Admin.model.js";
import Employee from "../models/Employee.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    console.log("authentication function")
    const token = req.cookies.jwt;
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token provided" });
    }
    console.log("hello")
    const decoded = jwt.verify(token, conf.JWT_SECRET);
    console.log(decoded)
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    let user;

    switch (decoded.role) {
      case "Admin":
        user = await Admin.findById(decoded.userId).select("-password");
        break;
      case "User":
        user = await User.findById(decoded.userId).select("-password");
        break;
      case "Employee":
        user = await Employee.findById(decoded.userId).select("-password");
        break;
      default:
        return res.status(400).json({ error: "Invalid role in token" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("here")
    req.user = user;
    req.user.role = decoded.role;
    console.log("about next")
    next();
  } catch (error) {
    console.log("Error in isAuthenticated middleware", error.message);
    return res.status(500).json({ error: "Internal server Error" });
  }
};
