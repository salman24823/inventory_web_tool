import mongoose from "mongoose";

const factorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const factoryModel =
  mongoose.models.factory || mongoose.model("factory", factorySchema);

export default factoryModel;
