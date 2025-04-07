// app/models/Stock.js
import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    companyName: { type: String },
    phone: { type: String },
    stockName: { type: String },
    totalPrice: { type: Number },
    amountPaid: { type: Number },
    quantity: { type: Number },
    unit: { type: String },
    quality: { type: String },
    issueDate: { type: Date },
    deadline: { type: Date },
  },
  { timestamps: true }
);

// Check if the model already exists to avoid redefining it
const grayModel = mongoose.models.grayModel || mongoose.model("grayModel", stockSchema);

export default grayModel;