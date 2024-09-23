import Feedback from "../models/Feedback.model.js";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.model.js"; // Adjust the import as needed

export const postFeedback = async (req, res) => {
  try {
    const { Content } = req.body;

    if (!Content || Content.trim() === "") {
      return res.status(400).json({ error: "Content is required" });
    }

    const userId = req.user._id; // Assuming _id is a string or ObjectId

    // Create a new feedback entry
    const newFeedback = new Feedback({
      FeedbackID: uuidv4(),
      UserID: userId,
      Content,
    });

    await newFeedback.save();

    // Add feedback ID to the user's feedback list
    await User.findByIdAndUpdate(
      userId,
      { $push: { Feedback: newFeedback._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Feedback posted successfully", feedback: newFeedback });
  } catch (err) {
    console.error("Error in postFeedback controller:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const { role } = req.user; // Ensure req.user is properly set up by authentication middleware

    if (role === "user") {
      // Fetch the user and populate the Feedback field
      const user = await User.findById(req.user._id).populate("Feedback");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.Feedback || user.Feedback.length === 0) {
        return res
          .status(404)
          .json({ message: "No feedback found for this user" });
      }

      return res.status(200).json(user.Feedback);
    } else if (role === "Admin") {
      // Fetch all feedback from the Feedback model for admin role
      const allFeedback = await Feedback.find();

      if (!allFeedback || allFeedback.length === 0) {
        return res.status(404).json({ message: "No feedback found" });
      }

      return res.status(200).json(allFeedback);
    } else if (role === "employee") {
      // Fetch all feedback for employees
      // If you want to retrieve feedback related to employees in a specific way,
      // modify this according to the relationship between Employee and Feedback
      const employeeFeedback = await Feedback.find(); // Adjust if there's a specific relation

      if (!employeeFeedback || employeeFeedback.length === 0) {
        return res.status(404).json({ message: "No feedback found" });
      }

      return res.status(200).json(employeeFeedback);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
