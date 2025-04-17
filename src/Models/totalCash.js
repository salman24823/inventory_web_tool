import mongoose from "mongoose";

// Define Schema
const cashSchema = new mongoose.Schema(
  {
    totalCash: {
      type: Number,
      required: false,
    }
  },
  { timestamps: true } 
);

// Prevent OverwriteModelError
const cashModel = mongoose.models.totalCash || mongoose.model("totalCash", cashSchema);

export default cashModel;
