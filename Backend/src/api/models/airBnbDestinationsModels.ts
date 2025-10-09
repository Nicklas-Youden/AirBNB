import mongoose, { Schema } from "mongoose";

interface AirBnbDestination {
  title: string;
  roomType: string;
  description: string;
  address: string;
  city: string;
  country: string;
  price: number;
  images: string[];
  //   host: string;
  amenities: string[];
  averageRating?: number;
  reviewCount?: number;
  rating: number; //temporary
  maxGuests?: number;
  bedRooms: number;
  bathRooms: number;
  beds: number;
  //   reviews: { user: string; comment: string; rating: number }[];
  availability: { from: Date; to: Date }[];
  occupied?: boolean;
}

const airBnbDestinations: Schema = new Schema({
  title: { type: String, required: true },
  roomType: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: false },
  //   host: { type: String, required: true },
  amenities: { type: [String], required: true },
  averageRating: { type: Number, required: false },
  reviewCount: { type: Number, required: false },
  rating: { type: Number, required: false }, //temporary
  maxGuests: { type: Number, required: true },
  bedRooms: { type: Number, required: true },
  bathRooms: { type: Number, required: true },
  beds: { type: Number, required: true },
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
  available: {
    type: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    _id: false,
    required: true,
  },
  occupied: { type: Boolean, required: false, default: false },
});

export const AirBnbDestinationsModel = mongoose.model<AirBnbDestination>(
  "AirBnbDestination",
  airBnbDestinations
);
