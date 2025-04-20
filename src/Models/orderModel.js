import mongoose from "mongoose";

// Schema for each individual item in the order
const OrderItemSchema = new mongoose.Schema(
  {
    stockId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: String },
    quality: { type: String },
    unit: { type: String },
    totalPrice: { type: String },
  },
  { _id: false } // Prevents MongoDB from generating a separate _id for each item
);

// Schema for installments (if needed)
const InstallmentSchema = new mongoose.Schema(
  {
    amount: { type: Number },
    transactionType: { type: String },    
    date: {
      type: String,
      default: () => {
        return new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Karachi",
        });
      },
    },
  },
  { _id: false }
);

// Main Order Schema
const OrderSchema = new mongoose.Schema(
  {
    user: { type: String },
    name: { type: String },
    phone: { type: String },
    items: [OrderItemSchema], // <<-- Multiple items
    amountPaid: { type: String },
    orderStatus: { type: String },
    isCancelled: { type: Boolean, default: false },
    issueDate: { type: String },
    deadline: { type: String },
    orderImage: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/000/350/131/small/4__2832_29.jpg",
    },
    userImage: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg",
    },
    installments: [InstallmentSchema],
  },
  { timestamps: true }
);

export default mongoose.models.orderModel ||
  mongoose.model("orderModel", OrderSchema);
