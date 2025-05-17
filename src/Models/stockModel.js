import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    // Basic Info
    factoryName: { type: String }, 
    purchaseOrderNumber: { type: String }, 
    clothQuality: { type: String }, 

    // Quantities
    grayClothQuantity: { type: Number }, 
    scratchQuantity: { type: Number }, 
    unitType: { type: String }, 
    stockQuantity: { type: Number }, 

    // Per Unit Costs
    baseCostPerUnit: { type: Number },
    factoryPaymentPerUnit: { type: Number },
    transportExpenses: { type: Number },

    // Charges
    perUnitCharges: [{}], 
    fixedCharges: [{}], 
    totalFixedCost: { type: Number },
    totalPerUnitCost: { type: Number },

    // Cost info
    netBaseCost: { type: Number },
    totalMiscellaneousCost: { type: Number },

    totalCost: { type: Number },

    //  Payment Info
    amountPaid: { type: Number },
    pendingPayment: { type: Number },

    // Dates
    issueDate: { type: Date },
    deadlineDate: { type: Date },
  },
  { timestamps: true }
);

const StockModel =
  mongoose.models.StockModel || mongoose.model("StockModel", stockSchema);

export default StockModel;
