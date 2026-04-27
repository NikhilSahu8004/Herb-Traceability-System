import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    stage: String,
    actor: String,
    location: String,
    notes: String,
    metrics: {
      temperatureCelsius: Number,
      humidityPercent: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const labReportSchema = new mongoose.Schema(
  {
    reportId: String,
    labName: String,
    purityPercent: Number,
    moisturePercent: Number,
    result: {
      type: String,
      enum: ["Pass", "Review", "Fail"],
      default: "Pass"
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const processingSchema = new mongoose.Schema(
  {
    processCode: String,
    manufacturerName: String,
    formulationName: String,
    packagingStatus: String,
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const auditSchema = new mongoose.Schema(
  {
    action: String,
    actor: String,
    role: String,
    summary: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const batchSchema = new mongoose.Schema(
  {
    batchCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    batchNo: {
      type: String,
      trim: true
    },
    herbName: String,
    botanicalName: String,
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    collectorName: String,
    sourceType: String,
    quantityKg: Number,
    harvestDate: Date,
    origin: {
      region: String,
      geo: {
        latitude: Number,
        longitude: Number
      }
    },
    qualityMetrics: {
      overallScore: {
        type: Number,
        default: 88
      },
      purityPercent: {
        type: Number,
        default: 93
      },
      moisturePercent: {
        type: Number,
        default: 9
      }
    },
    compliance: {
      ayush: {
        type: Boolean,
        default: false
      },
      certificateStatus: {
        type: String,
        default: "Pending"
      }
    },
    blockchain: {
      network: {
        type: String,
        default: "Simulated Ledger"
      },
      isAnchored: {
        type: Boolean,
        default: true
      },
      status: {
        type: String,
        default: "Ready"
      },
      txHash: String,
      anchoredAt: Date,
      anchorNotes: String
    },
    analytics: {
      verificationScore: {
        type: Number,
        default: 88
      }
    },
    currentStage: {
      type: String,
      default: "Collection"
    },
    qrCodeData: String,
    labReportIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LabReport"
      }
    ],
    processingIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Processing"
      }
    ],
    events: [eventSchema],
    labReports: [labReportSchema],
    processingLog: [processingSchema],
    auditLog: [auditSchema]
  },
  {
    timestamps: true
  }
);

export const Batch = mongoose.model("Batch", batchSchema);
