import mongoose from "mongoose";

const poSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const poModel = mongoose.models.PO || mongoose.model("PO", poSchema);

export default poModel;
