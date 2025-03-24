import mongoose from "mongoose";

const InstallmentSchema = new mongoose.Schema(
  {
    amount: { type: Number },
    transactionType: { type: String },
    date: {
      type: String, // Store as a string in YYYY-MM-DD format
      default: () => {
        return new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Karachi",
        });
      },
    },
  },
  { _id: false } // Prevents Mongoose from generating an ID for each installment
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: String },
    name: { type: String },
    stockId: { type: mongoose.Schema.Types.ObjectId },
    phone: { type: String },
    orderName: { type: String },
    quantity: { type: String },
    quality: { type: String },
    totalPrice: { type: String },
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
    installments: [InstallmentSchema], // Array to store installments
  },
  { timestamps: true }
);

export default mongoose.models.orderModel ||
  mongoose.model("orderModel", OrderSchema);
