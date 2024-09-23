import Service from "../models/Service.model.js"; // Assuming Service model exists
import { v4 as uuidv4 } from "uuid";

export const addService = async (req, res) => {
  try {
    const { name, description, price, category, duration, imageURL } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ error: "Name, Price, and Category are required" });
    }
    if (!imageURL) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Create a new service with the provided data
    const newService = new Service({
      ServiceID: uuidv4(), // Generate unique ServiceID
      Name: name,
      Description: description || "",
      Price: price,
      Category: category,
      Duration: duration,
      ImageURL: imageURL,
    });

    // Save the service to the database
    await newService.save();

    res.status(201).json({
      message: "Service added successfully",
      service: newService,
    });
  } catch (error) {
    console.error("Error adding service:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id: serviceId } = req.params; // Extract the service ID from the request params
    console.log("Received Service ID for deletion:", serviceId);

    if (!serviceId) {
      return res.status(400).json({ error: "Service ID is required" });
    }

    // Correct the query to specify the _id field
    const service = await Service.findOneAndDelete({ _id: serviceId });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({ error: "Error deleting service" });
  }
};

export const getService = async (req, res) => {
  try {
    // Fetch all services from the database
    const services = await Service.find();

    // Respond with the list of services
    res.status(200).json({
      message: "Services fetched successfully",
      services,
    });
  } catch (err) {
    console.error("Error fetching services:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params; // This is the ServiceID from the URL
    const { name, description, price, category, duration, imageURL } = req.body;

    // Debugging log
    console.log("ServiceID received:", id);

    // Update the service by ServiceID
    const updatedService = await Service.findOneAndUpdate(
      { _id: id }, // Match using _id field
      {
        Name: name,
        Description: description,
        Price: price,
        Category: category,
        Duration: duration,
        ImageURL: imageURL,
      },
      { new: true, runValidators: true } // Return the updated service
    );

    // If no service was found, return 404
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Return success response with updated service
    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ error: "Failed to update service" });
  }
};
