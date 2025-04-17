import mongoose from "mongoose";

const SpendingSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    method: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SpendingModel || mongoose.model("SpendingModel", SpendingSchema);
