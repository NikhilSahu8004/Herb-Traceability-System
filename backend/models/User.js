import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    farmLocation: String,
    role: {
      type: String,
      enum: ["Farmer", "Lab", "Manufacturer", "Admin"],
      default: "Farmer"
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model("User", userSchema);
