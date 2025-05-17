import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        stockId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StockModel",
          required: true,
        },
        stockName: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        salePricePerUnit: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
    },
    transactionType: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    installments: [
      {
        amount: {
          type: Number,
          required: true,
        },
        transactionType: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;