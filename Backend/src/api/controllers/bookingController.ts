import { Request, Response } from "express";
import { BookingModel } from "../models/bookingModels";
import { AirBnbDestinationsModel } from "../models/airBnbDestinationsModels";

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const bookings = await BookingModel.aggregate([
      {
        $match: { userId },
      },
      {
        $lookup: {
          from: "airbnbdestinations",
          localField: "destinationId",
          foreignField: "_id",
          as: "destinationDetails",
        },
      },
      {
        $unwind: "$destinationDetails",
      },
    ]);

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings", error });
  }
};

export const postUserBooking = async (req: Request, res: Response) => {
  try {
    const { destinationId, email, guests } = req.body;
    const userId = req.user?.userId;

    if (!destinationId || !email || !guests) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newBooking = new BookingModel({
      destinationId,
      userId,
      email,
      guests,
    });
    await newBooking.save();

    await AirBnbDestinationsModel.findByIdAndUpdate(destinationId, {
      $set: { occupied: true },
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create booking", error });
  }
};

export const deleteUserBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?.userId;

    const booking = await BookingModel.findOneAndDelete({
      _id: bookingId,
      userId,
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found or unauthorized" });
    }

    await AirBnbDestinationsModel.findByIdAndUpdate(booking.destinationId, {
      $set: { occupied: false },
    });

    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete booking", error });
  }
};
