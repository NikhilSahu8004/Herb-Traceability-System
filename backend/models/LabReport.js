import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true
    },
    labUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reportId: String,
    purityPercent: Number,
    moisturePercent: Number,
    result: {
      type: String,
      enum: ["Pass", "Review", "Fail"],
      default: "Pass"
    },
    notes: String
  },
  {
    timestamps: true
  }
);

export const LabReport = mongoose.model("LabReport", labReportSchema);
