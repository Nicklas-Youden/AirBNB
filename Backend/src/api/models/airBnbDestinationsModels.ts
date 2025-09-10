import mongoose, { Schema } from "mongoose";

interface AirBnbDestination {
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  price: number;
  images: string[];
  //   host: string;
  //   amenities: string[];
  totalRating: number;
  //   reviews: { user: string; comment: string; rating: number }[];
  availability: { from: Date; to: Date }[];
  maxGuests?: number;
}

const airBnbDestinations: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: false },
  country: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: false },
  //   host: { type: String, required: true },
  //   amenities: { type: [String], required: true },
  totalRating: { type: Number, required: false },
  //   reviews: {
  //     type: [
  //       {
  //         user: { type: String, required: true },
  //         comment: { type: String, required: true },
  //         rating: { type: Number, required: true },
  //       },
  //     ],
  //     required: true,
  //   },
  availability: {
    type: [
      {
        from: { type: Date, required: false },
        to: { type: Date, required: false },
      },
    ],
    required: false,
  },
  maxGuests: { type: Number, required: false },
});

export const AirBnbDestinationsModel = mongoose.model<AirBnbDestination>(
  "AirBnbDestination",
  airBnbDestinations
);
