import mongoose from "mongoose";

// Define Schema
const customerSchema = new mongoose.Schema(
  {
    image: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    totalPayment: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        required: true 
    },
    pendingPayment: { 
        type: String, 
        required: true 
    },
    orderId: { 
        type: String, 
        required: true 
    }
  },
  { timestamps: true } 
);

// Prevent OverwriteModelError
const customerModel = mongoose.models.customers || mongoose.model("customers", customerSchema);

export default customerModel;
