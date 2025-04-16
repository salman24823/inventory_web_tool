import mongoose from "mongoose";

// Define Schema
const cashSchema = new mongoose.Schema(
  {
    orderID: {
      type: String,
      required: false,
    },
    totalCash: {
      type: String,
      required: false,
    }
  },
  { timestamps: true } 
);

// Prevent OverwriteModelError
const cashModel = mongoose.models.totalCash || mongoose.model("totalCash", cashSchema);

export default cashModel;
