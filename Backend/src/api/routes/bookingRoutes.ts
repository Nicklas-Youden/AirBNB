import { Router } from "express";

import { authenticateToken } from "../../middleware/auth";
import {
  deleteUserBooking,
  getUserBookings,
  postUserBooking,
  cancelUserBooking,
} from "../controllers/bookingController";

const router = Router();

// Protected routes (require authentication)
router.post("/", authenticateToken, postUserBooking);
router.get("/", authenticateToken, getUserBookings);
router.put("/cancel/:id", authenticateToken, cancelUserBooking);
router.delete("/:id", authenticateToken, deleteUserBooking);

export default router;
