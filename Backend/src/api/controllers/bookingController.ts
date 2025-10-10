import { Request, Response } from "express";
import { BookingModel } from "../models/bookingModels";
import { AirBnbDestinationsModel } from "../models/airBnbDestinationsModels";

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Extract pagination parameters from query
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;
    const skip = (pageNumber - 1) * pageSize;

    const now = new Date();
    await BookingModel.aggregate([
      {
        $match: { userId, stayEnded: false },
      },
      {
        $addFields: {
          destinationObjectId: { $toObjectId: "$destinationId" },
        },
      },
      {
        $lookup: {
          from: "airbnbdestinations",
          localField: "destinationObjectId",
          foreignField: "_id",
          as: "destination",
        },
      },
      {
        $unwind: "$destination",
      },
      {
        $match: {
          "destination.available.to": {
            $lt: now,
          },
        },
      },
      {
        $set: {
          stayEnded: true,
        },
      },
      {
        $unset: "destinationObjectId"
      },
      {
        $unset: "destination"
      },
      {
        $merge: {
          into: "bookings",
          whenMatched: "replace"
        }
      }
    ]);

    // Get total count of user's bookings
    const totalBookings = await BookingModel.countDocuments({ userId });

    const bookings = await BookingModel.aggregate([
      {
        $match: { userId },
      },
      {
        $addFields: {
          destinationObjectId: { $toObjectId: "$destinationId" },
        },
      },
      {
        $lookup: {
          from: "airbnbdestinations",
          localField: "destinationObjectId",
          foreignField: "_id",
          as: "destinationDetails",
        },
      },
      {
        $unwind: "$destinationDetails",
      },
      {
        $addFields: {
          "destinationDetails.stayEnded": { $ifNull: ["$stayEnded", false] },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$destinationDetails",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
    ]);

    const totalPages = Math.ceil(totalBookings / pageSize);

    const paging = {
      pageNumber,
      pageSize,
      totalCount: totalBookings,
      totalPages,
      isFirstPage: pageNumber === 1,
      isLastPage: pageNumber === totalPages,
    };

    res.status(200).json({
      bookings,
      paging,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
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
    res.status(500).json({ message: "Failed to create booking" });
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
        .json({ message: "Booking not found or unauthorized" });
    }

    await AirBnbDestinationsModel.findByIdAndUpdate(booking.destinationId, {
      $set: { occupied: false },
    });

    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
