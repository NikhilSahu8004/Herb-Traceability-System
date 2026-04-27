import { Batch } from "../models/Batch.js";
import { qrService } from "../services/qrService.js";

function buildAuditEntry({ action, actor, role, summary }) {
  return {
    action,
    actor,
    role,
    summary,
    createdAt: new Date()
  };
}

function buildTxHash(batchCode, processCode) {
  const seed = `${batchCode}-${processCode}-${Date.now()}`.replace(/[^a-zA-Z0-9]/g, "");
  return `0x${seed.toLowerCase().slice(0, 32).padEnd(32, "0")}`;
}

function summarizeDashboard(items) {
  const totalBatches = items.length;
  const verifiedBatches = items.filter((item) => (item.qualityMetrics?.overallScore || 0) >= 85).length;
  const totalEvents = items.reduce((sum, item) => sum + (item.events?.length || 0), 0);
  const complianceRate = totalBatches
    ? Math.round((items.filter((item) => item.compliance?.ayush).length / totalBatches) * 100)
    : 0;
  const qualityAverage = totalBatches
    ? Math.round(
        items.reduce((sum, item) => sum + (item.qualityMetrics?.overallScore || 0), 0) / totalBatches
      )
    : 0;

  const regionActivity = items.reduce((accumulator, item) => {
    const region = item.origin?.region || "Unknown";
    accumulator[region] = (accumulator[region] || 0) + 1;
    return accumulator;
  }, {});

  const qualityTrends = {
    high: items.filter((item) => (item.qualityMetrics?.overallScore || 0) >= 90).length,
    medium: items.filter((item) => {
      const score = item.qualityMetrics?.overallScore || 0;
      return score >= 75 && score < 90;
    }).length,
    review: items.filter((item) => (item.qualityMetrics?.overallScore || 0) < 75).length
  };

  return {
    overview: {
      totalBatches,
      verifiedBatches,
      totalEvents,
      complianceRate,
      qualityAverage
    },
    analytics: {
      verificationRate: totalBatches ? Math.round((verifiedBatches / totalBatches) * 100) : 0,
      regionActivity,
      qualityTrends
    }
  };
}

export async function getDashboard(req, res) {
  const items = req.app.locals.mockMode
    ? req.app.locals.mockStore.listBatches()
    : await Batch.find().sort({ createdAt: -1 }).lean();
  return res.json(summarizeDashboard(items));
}

export async function getAllBatches(req, res) {
  const items = req.app.locals.mockMode
    ? req.app.locals.mockStore.listBatches()
    : await Batch.find().sort({ createdAt: -1 }).lean();
  return res.json({ items });
}

export async function getBatchById(req, res) {
  const item = req.app.locals.mockMode
    ? req.app.locals.mockStore.findBatchById(req.params.id)
    : await Batch.findById(req.params.id).lean();
  if (!item) {
    return res.status(404).json({ message: "Batch not found" });
  }
  return res.json(item);
}

export async function deleteBatch(req, res) {
  const item = req.app.locals.mockMode
    ? req.app.locals.mockStore.deleteBatch(req.params.id)
    : await Batch.findByIdAndDelete(req.params.id).lean();

  if (!item) {
    return res.status(404).json({ message: "Batch not found" });
  }

  return res.json({
    message: "Product deleted successfully",
    item
  });
}

export async function createBatch(req, res) {
  const batchCode = req.body.batchCode.toUpperCase();
  const ayushStatus = req.body.ayushStatus || "Pending";
  const isAyushReady = ayushStatus === "Verified";
  const payload = {
    batchCode,
    batchNo: req.body.batchNo,
    herbName: req.body.herbName,
    botanicalName: req.body.botanicalName,
    farmerId: req.user._id,
    collectorName: req.user.name,
    sourceType: req.body.sourceType,
    quantityKg: req.body.quantityKg,
    harvestDate: req.body.harvestDate,
    origin: {
      region: req.body.region,
      geo: {
        latitude: req.body.latitude,
        longitude: req.body.longitude
      }
    },
    compliance: {
      ayush: isAyushReady,
      certificateStatus: ayushStatus
    },
    analytics: {
      verificationScore: isAyushReady ? 86 : 72
    },
    blockchain: {
      network: "Simulated Ledger",
      isAnchored: false,
      status: "Awaiting verification",
      anchorNotes: "Blockchain anchor will be generated after manufacturing confirmation."
    },
    qrCodeData: qrService.makeTracePayload({
      batchCode,
      batchNo: req.body.batchNo,
      herbName: req.body.herbName,
      region: req.body.region
    }),
    events: [
      {
        stage: "Collection",
        actor: req.user.name,
        location: req.body.region,
        notes: `Collection created by ${req.user.name}.`
      }
    ],
    auditLog: [
      buildAuditEntry({
        action: "Batch created",
        actor: req.user.name,
        role: req.user.role,
        summary: `${batchCode} was registered with geo-tagged harvest details.`
      })
    ]
  };

  const item = req.app.locals.mockMode ? req.app.locals.mockStore.createBatch(payload) : await Batch.create(payload);
  return res.status(201).json({ item });
}

export async function addBatchEvent(req, res) {
  if (req.app.locals.mockMode) {
    const updated = req.app.locals.mockStore.addBatchEvent(req.params.id, {
      stage: req.body.stage,
      actor: req.body.actor || req.user.name,
      location: req.body.location,
      notes: req.body.notes,
      metrics: {
        temperatureCelsius: req.body.temperatureCelsius,
        humidityPercent: req.body.humidityPercent
      },
      labReport: req.body.labReport,
      processing: req.body.processing,
      actorRole: req.user.role
    });

    if (!updated) {
      return res.status(404).json({ message: "Batch not found" });
    }

    return res.status(201).json({ item: updated });
  }

  const item = await Batch.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Batch not found" });
  }

  item.analytics = item.analytics || {};
  item.qualityMetrics = item.qualityMetrics || {};
  item.compliance = item.compliance || {};
  item.blockchain = item.blockchain || {};
  item.events = item.events || [];
  item.labReports = item.labReports || [];
  item.processingLog = item.processingLog || [];
  item.auditLog = item.auditLog || [];

  item.events.push({
    stage: req.body.stage,
    actor: req.body.actor || req.user.name,
    location: req.body.location,
    notes: req.body.notes,
    metrics: {
      temperatureCelsius: req.body.temperatureCelsius,
      humidityPercent: req.body.humidityPercent
    }
  });
  item.currentStage = req.body.stage;

  if (req.body.labReport) {
    item.labReports.push({
      ...req.body.labReport,
      labName: req.user.name,
      notes: req.body.notes
    });
    item.qualityMetrics.purityPercent = req.body.labReport.purityPercent;
    item.qualityMetrics.moisturePercent = req.body.labReport.moisturePercent;
    item.qualityMetrics.overallScore =
      req.body.labReport.result === "Pass" ? 95 : req.body.labReport.result === "Review" ? 78 : 58;
    item.analytics.verificationScore = item.qualityMetrics.overallScore;
    item.compliance.ayush = req.body.labReport.result === "Pass";
    item.compliance.certificateStatus =
      req.body.labReport.result === "Pass" ? "Verified" : req.body.labReport.result;
    item.blockchain.status =
      req.body.labReport.result === "Pass" ? "Ready for anchoring" : "Verification hold";
    item.auditLog.push(
      buildAuditEntry({
        action: "Lab report uploaded",
        actor: req.user.name,
        role: req.user.role,
        summary: `${req.body.labReport.reportId} recorded a ${req.body.labReport.result} result.`
      })
    );
  }

  if (req.body.processing) {
    const txHash = buildTxHash(item.batchCode, req.body.processing.processCode);
    item.processingLog.push({
      ...req.body.processing,
      manufacturerName: req.user.name,
      notes: req.body.notes
    });
    item.blockchain.isAnchored = true;
    item.blockchain.status = "Anchored";
    item.blockchain.txHash = txHash;
    item.blockchain.anchoredAt = new Date();
    item.blockchain.anchorNotes = `Manufacturing checkpoint anchored for ${req.body.processing.processCode}.`;
    item.auditLog.push(
      buildAuditEntry({
        action: "Manufacturing update",
        actor: req.user.name,
        role: req.user.role,
        summary: `${req.body.processing.processCode} moved to ${req.body.processing.packagingStatus}.`
      })
    );
  }

  if (!req.body.labReport && !req.body.processing) {
    item.auditLog.push(
      buildAuditEntry({
        action: "Stage updated",
        actor: req.user.name,
        role: req.user.role,
        summary: `${item.batchCode} moved to ${req.body.stage}.`
      })
    );
  }

  await item.save();
  return res.status(201).json({ item });
}

export async function verifyBatch(req, res) {
  const item = req.app.locals.mockMode
    ? req.app.locals.mockStore.findBatchByCode(req.params.batchCode)
    : await Batch.findOne({
        batchCode: req.params.batchCode.toUpperCase()
      }).lean();

  if (!item) {
    return res.status(404).json({ message: "Batch not found" });
  }

  return res.json({
    batchCode: item.batchCode,
    batchNo: item.batchNo,
    herbName: item.herbName,
    botanicalName: item.botanicalName,
    collectorName: item.collectorName,
    sourceType: item.sourceType,
    quantityKg: item.quantityKg,
    harvestDate: item.harvestDate,
    currentStage: item.currentStage,
    origin: item.origin,
    qualityMetrics: item.qualityMetrics,
    compliance: item.compliance,
    blockchain: item.blockchain,
    labReports: item.labReports || [],
    processingLog: item.processingLog || [],
    events: item.events || [],
    auditLog: item.auditLog || [],
    trustStatus: item.compliance?.ayush ? "Trusted and verified" : "Awaiting verification",
    qualityScore: item.qualityMetrics?.overallScore
  });
}

export async function getBatchQr(req, res) {
  const item = req.app.locals.mockMode
    ? req.app.locals.mockStore.findBatchById(req.params.id)
    : await Batch.findById(req.params.id).lean();
  if (!item) {
    return res.status(404).json({ message: "Batch not found" });
  }

  const png = await qrService.makeQrPng(item.qrCodeData || qrService.makeTracePayload(item));
  res.setHeader("Content-Type", "image/png");
  return res.send(png);
}
