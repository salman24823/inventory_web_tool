import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    orderName: { type: String },
    totalPrice: { type: String },
    amountPaid: { type: String },
    issueDate: { type: String },
    deadline: { type: String },
    orderImage: { type: String, default: "https://static.vecteezy.com/system/resources/thumbnails/000/350/131/small/4__2832_29.jpg" },
    userImage: { type: String, default: "https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg" },
  },
  { timestamps: true }
);

export default mongoose.models.orderModel || mongoose.model("orderModel", OrderSchema);
