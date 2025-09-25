import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface User extends Document {
  username: string;
  email: string;
  password: string;
  phone: number;
  avatar?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    avatar: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<User>("User", userSchema);
