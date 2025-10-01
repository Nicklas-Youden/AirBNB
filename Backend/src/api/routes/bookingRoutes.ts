import { Router } from "express";

import { authenticateToken } from "../../middleware/auth";
import {
  deleteUserBooking,
  getUserBookings,
  postUserBooking,
} from "../controllers/bookingController";

const router = Router();

// Protected routes (require authentication)
router.post("/", authenticateToken, postUserBooking);
router.get("/", authenticateToken, getUserBookings);
router.delete("/:id", authenticateToken, deleteUserBooking);

export default router;
