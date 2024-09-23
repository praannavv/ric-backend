import BookedService from "../models/BookedServices.model.js";
import User from "../models/User.model.js"; // Ensure correct path
import { v4 as uuidv4 } from "uuid";
import Service from "../models/Service.model.js"; // Assuming you have a Service model
import { getUser } from "../lib/helper/getUser.js";

export const addBookedService = async (req, res) => {
  try {
    // Get user and role from the helper function
    const { user, role } = await getUser(req);

    if (!user || !user._id) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const { serviceID, flatRoomNo, streetName, pincode, city, totalPrice } =
      req.body;
      console.log("service Here")
    const service = await Service.findOne({ ServiceID: serviceID });

    // Validate if the service exists
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Create new booked service
    const newBookedService = new BookedService({
      ServiceBookedID: uuidv4(), // Generate unique ServiceBookedID
      ServiceID: service._id, // Ensure serviceID is a valid ObjectId
      UserID: user._id, // Ensure user._id is a valid ObjectId
      Status: "pending", // Ensure Status field is correct
      Flat: flatRoomNo,
      Street: streetName,
      City: city,
      PinCode: pincode,
      TotalPrice: totalPrice + 50, // Assuming an additional charge
      
    });

    // Save new booked service
    await newBookedService.save();

    // Update User's BookedServices array
    await User.findByIdAndUpdate(user._id, {
      $push: { BookedServices: newBookedService._id },
    });

    // Respond with the created booked service
    res.status(201).json(newBookedService);
  } catch (error) {
    console.error("Error creating booked service:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete Booked Service
export const deleteBookedService = async (req, res) => {
  try {
    const { bookedServiceID } = req.params;

    if (!bookedServiceID) {
      return res.status(400).json({ error: "BookedServiceID is required" });
    }

    // Find and delete the booked service
    const deletedBookedService = await BookedService.findOneAndDelete({
      ServiceBookedID: bookedServiceID,
    });

    if (!deletedBookedService) {
      return res.status(404).json({ error: "Booked service not found" });
    }

    // Remove the booked service reference from the user's BookedServices array
    await User.findByIdAndUpdate(
      deletedBookedService.UserID,
      { $pull: { BookedServices: deletedBookedService._id } },
      { new: true }
    );

    res.status(200).json({ message: "Booked service deleted successfully" });
  } catch (error) {
    console.error("Error deleting booked service:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Booked Service by ID
export const getBookedService = async (req, res) => {
  try {
    const { bookedServiceID } = req.params;

    if (!bookedServiceID) {
      return res.status(400).json({ error: "BookedServiceID is required" });
    }

    // Find the booked service
    const bookedService = await BookedService.findOne({
      ServiceBookedID: bookedServiceID,
    })
      .populate("UserID") // Populate User details
      .populate("ServiceID"); // Populate Service details

    if (!bookedService) {
      return res.status(404).json({ error: "Booked service not found" });
    }

    res.status(200).json(bookedService);
  } catch (error) {
    console.error("Error fetching booked service:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get All Booked Services
export const getAllBookedServices = async (req, res) => {
  try {
    const bookedServices = await BookedService.find()
      .populate("UserID") // Populate User details
      .populate("ServiceID"); // Populate Service details

    res.status(200).json(bookedServices);
  } catch (error) {
    console.error("Error fetching booked services:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Booked Service
export const updateBookedService = async (req, res) => {
  try {
    const { bookedServiceID } = req.params;
    const { userID, serviceID, address, status, completionDate } = req.body;

    if (!bookedServiceID) {
      return res.status(400).json({ error: "BookedServiceID is required" });
    }

    // Update the booked service
    const updatedBookedService = await BookedService.findOneAndUpdate(
      { ServiceBookedID: bookedServiceID },
      {
        UserID: userID,
        ServiceID: serviceID,
        Address: address,
        Status: status,
        CompletionDate: completionDate,
      },
      { new: true }
    );

    if (!updatedBookedService) {
      return res.status(404).json({ error: "Booked service not found" });
    }

    res
      .status(200)
      .json({
        message: "Booked service updated successfully",
        bookedService: updatedBookedService,
      });
  } catch (error) {
    console.error("Error updating booked service:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
