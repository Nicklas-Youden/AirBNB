import mongoose, { Schema, Document } from "mongoose";

interface Booking extends Document {
  destinationId: string;
  userId: string;
  email: string;
  guests: number;
}

const bookingSchema: Schema = new Schema(
  {
    destinationId: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    guests: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const BookingModel = mongoose.model<Booking>("Booking", bookingSchema);
