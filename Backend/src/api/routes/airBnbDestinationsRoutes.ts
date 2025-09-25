import { Router } from "express";
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/airBnbDestinationsController";

const router = Router();

// Get all Destinations
router.get("/", getAllDestinations);

// Get a single destination by ID
router.get("/:id", getDestinationById);

// Create a new destination
router.post("/", createDestination);

// Update a destination by ID
router.put("/:id", updateDestination);
router.patch("/:id", updateDestination);

// Delete a destination by ID
router.delete("/:id", deleteDestination);

export default router;
