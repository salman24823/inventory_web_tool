import mongoose from "mongoose";

// Define Schema
const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique : true
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } 
);

// Prevent OverwriteModelError
const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;
