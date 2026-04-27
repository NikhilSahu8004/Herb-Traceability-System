import { Batch } from "../models/Batch.js";
import { LabReport } from "../models/LabReport.js";

export async function addLabReport(req, res) {
  const batch = await Batch.findById(req.params.batchId);

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  const report = await LabReport.create({
    batchId: batch._id,
    labUserId: req.user._id,
    reportId: req.body.labReport?.reportId,
    purityPercent: req.body.labReport?.purityPercent,
    moisturePercent: req.body.labReport?.moisturePercent,
    result: req.body.labReport?.result,
    notes: req.body.notes
  });

  batch.events.push({
    stage: "Testing",
    actor: req.user.name,
    location: req.body.location || "Lab Facility",
    notes: req.body.notes,
    metrics: {
      temperatureCelsius: req.body.temperatureCelsius,
      humidityPercent: req.body.humidityPercent
    }
  });

  batch.currentStage = "Testing";
  batch.labReportIds.push(report._id);
  batch.qualityMetrics.purityPercent = req.body.labReport?.purityPercent;
  batch.qualityMetrics.moisturePercent = req.body.labReport?.moisturePercent;
  batch.qualityMetrics.overallScore = req.body.labReport?.result === "Fail" ? 62 : 95;
  await batch.save();

  return res.status(201).json({ item: report });
}

export async function getLabDashboard(req, res) {
  const items = await Batch.find({
    currentStage: {
      $in: ["Collection", "Testing"]
    }
  })
    .sort({ updatedAt: -1 })
    .lean();
  return res.json({ items });
}
