import { v4 as uuidv4 } from "uuid";
import Complaint from "../models/Complaint.model";
export const postComplaint = async (req, res) => {
  try {
    const { userID, description, serviceType } = req.body;

    // Validate required fields
    if (!userID || !description || !serviceType) {
      return res
        .status(400)
        .json({ error: "UserID, Description, and ServiceType are required" });
    }

    // Create a new complaint
    const newComplaint = new Complaint({
      ComplaintID: uuidv4(),
      UserID: userID,
      Description: description,
      ServiceType: serviceType, // Adjust this according to your schema
    });

    // Save the complaint
    const savedComplaint = await newComplaint.save();

    // Assign the complaint to an employee
    const assignmentMessage = await assignComplaintToEmployee(
      savedComplaint._id
    );

    res.status(201).json({
      message: "Complaint posted successfully",
      complaint: savedComplaint,
      assignment: assignmentMessage,
    });
  } catch (error) {
    console.error("Error posting complaint:", error.message);
    res.status(500).json({ error: "Error posting complaint" });
  }
};

export const deleteComplaint = async (req, res) => {};
