import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModels";

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password || !confirmPassword || !phone) {
      res.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        message: "Invalid email format",
      });
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "User already exists with this email",
      });
      return;
    }

    if (!/^[0-9]{8}$/.test(phone)) {
      res.status(400).json({
        message: "Phone number must be 8 digits long and numeric",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        message: "Passwords do not match",
      });
      return;
    }

    const user = new UserModel({
      name,
      email,
      password,
      phone,
    });

    await user.save();

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    };
    const token = jwt.sign(payload, JWT_SECRET);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,

      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    };
    const token = jwt.sign(payload, JWT_SECRET);

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,

      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, phone, avatar } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete user account (protected route)
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Find and delete the user
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      id: deletedUser._id,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
