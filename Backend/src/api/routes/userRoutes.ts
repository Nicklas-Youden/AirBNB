import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from "../controllers/userController";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
router.delete("/profile", authenticateToken, deleteUser);

export default router;
