import { Request, Response } from "express";
import { AirBnbDestinationsModel } from "../models/airBnbDestinationsModels";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup temp directory for multer
const tempDir = "./uploads/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Multer configuration for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

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

// Create a new destination with images
export const createDestination = async (req: Request, res: Response) => {
  try {
    const newDestination = new AirBnbDestinationsModel(req.body);
    await newDestination.save();

    const imagePaths: string[] = [];
    const files = req.files as Express.Multer.File[];

    if (files && files.length > 0) {
      // Create folder in public/images/destinations/:id
      const destinationDir = `./public/images/destinations/${newDestination._id}`;
      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      for (const file of files) {
        const newPath = path.join(destinationDir, file.filename);
        fs.renameSync(file.path, newPath); // move file
        imagePaths.push(
          `${baseUrl}/images/destinations/${newDestination._id}/${file.filename}`
        );
      }

      newDestination.images = imagePaths;
      await newDestination.save();
    }

    res.status(201).json({
      message: "Destination created successfully",
      destination: newDestination,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating destination",
      error,
    });
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

    // Clean up destination folder in public/images/destinations
    const destinationDir = `./public/images/destinations/${id}`;
    if (fs.existsSync(destinationDir)) {
      fs.rmSync(destinationDir, { recursive: true, force: true });
    }

    res.status(200).json({
      message: "Destination and images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting destination", error });
  }
};
