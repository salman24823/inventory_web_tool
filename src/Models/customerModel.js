import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    totalDealing: {
      type: Number,
      default: 0,
    },
    totalPending: {
      type: Number,
      default: 0,
    },
    lastCheckout: {
      type: Date,
    },
  },
  { timestamps: true }
);

const CustomerModel =
  mongoose.models.Customers || mongoose.model("Customers", customerSchema);

export default CustomerModel;