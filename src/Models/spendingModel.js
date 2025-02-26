import mongoose from "mongoose";

// Define Schema
const spendingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    checkBox: {
      type: String,
      enum: ["food", "other"],
      required: true,
    }
  },
  { timestamps: true }
);

// Prevent OverwriteModelError
const spendingModel =
  mongoose.models.spendings || mongoose.model("spendings", spendingSchema);

export default spendingModel;
