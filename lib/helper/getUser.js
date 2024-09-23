import conf from "../../conf/conf.js";
import User from "../../models/User.model.js";
import Admin from "../../models/Admin.model.js";
import Employee from "../../models/Employee.model.js";
import jwt from "jsonwebtoken";

export const getUser = async (req) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, conf.JWT_SECRET);
    if (!decoded) {
      throw new Error("Invalid token");
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
        throw new Error("Invalid role in token");
    }

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Error in getUser helper:", error.message);
    throw new Error("Error retrieving user");
  }
};
