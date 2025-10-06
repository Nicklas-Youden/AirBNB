import { Request, Response } from "express";
import { AirBnbDestinationsModel } from "../models/airBnbDestinationsModels";

// Get all Destinations with pagination
export const getAllDestinations = async (req: Request, res: Response) => {
  try {
    // Extract pagination parameters from query
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;
    const skip = (pageNumber - 1) * pageSize;

    const totalDestinations = await AirBnbDestinationsModel.countDocuments({
      occupied: false,
    });
    const destinations = await AirBnbDestinationsModel.find({ occupied: false })
      .skip(skip)
      .limit(pageSize);

    const totalPages = Math.ceil(totalDestinations / pageSize);

    const paging = {
      pageNumber,
      pageSize,
      totalCount: totalDestinations,
      totalPages,
      isFirstPage: pageNumber === 1,
      isLastPage: pageNumber === totalPages,
    };

    res.status(200).json({
      destinations,
      paging,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Destinations", error });
  }
};

// Get a single destination by ID
export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const destination = await AirBnbDestinationsModel.findById(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destination", error });
  }
};

// Create a new destination
export const createDestination = async (req: Request, res: Response) => {
  try {
    const newDestination = new AirBnbDestinationsModel(req.body);
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (error) {
    res.status(500).json({ message: "Error creating destination", error });
  }
};

// Update a destination by ID
export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedDestination = await AirBnbDestinationsModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(updatedDestination);
  } catch (error) {
    res.status(500).json({ message: "Error updating destination", error });
  }
};

// Delete a destination by ID
export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDestination = await AirBnbDestinationsModel.findByIdAndDelete(
      id
    );
    if (!deletedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting destination", error });
  }
};
