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
router.get("/destinations", getAllDestinations);

// Get a single destination by ID
router.get("/destinations/:id", getDestinationById);

// Create a new destination
router.post("/destinations", createDestination);

// Update a destination by ID
router.put("/destinations/:id", updateDestination);

// Delete a destination by ID
router.delete("/destinations/:id", deleteDestination);

export default router;
