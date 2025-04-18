import mongoose from "mongoose";

// Define Schema
const bankSchema = new mongoose.Schema(
  {
    totalBank: {
      type: Number,
      required: false,
    }
  },
  { timestamps: true } 
);

// Prevent OverwriteModelError
const bankModel = mongoose.models.totalBank || mongoose.model("totalBank", bankSchema);

export default bankModel;
