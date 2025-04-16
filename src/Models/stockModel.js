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
    costPerUnit: { type: String },
    quality: { type: String },
    issueDate: { type: Date },
    deadline: { type: Date },
    stockImage: { type: String , default : "https://5.imimg.com/data5/TestImages/GL/MI/EQ/SELLER-20488881/logo-corrugated-boxes-500x500.jpg" }, // URL for stock image
    companyLogo: { type:  String , default : "https://www.diabetes.ie/wp-content/uploads/2021/05/logo-Placeholder.jpg"  }, // URL for company logo
  },
  { timestamps: true }
);

// Check if the model already exists to avoid redefining it
const stockModel = mongoose.models.stockModel || mongoose.model("stockModel", stockSchema);

export default stockModel;