import mongoose from "mongoose";

const processingSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true
    },
    manufacturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    processCode: String,
    formulationName: String,
    packagingStatus: String,
    notes: String
  },
  {
    timestamps: true
  }
);

export const Processing = mongoose.model("Processing", processingSchema);
