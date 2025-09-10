import mongoose, { Schema } from "mongoose";

interface User {
  username: string;
  email: string;
  password: string;
  phone: number;
  avatar?: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  avatar: { type: String, required: false },
});

export const UserModel = mongoose.model<User>("User", userSchema);
