import { Batch } from "../models/Batch.js";
import { Processing } from "../models/Processing.js";

export async function addProcessingStep(req, res) {
  const batch = await Batch.findById(req.params.batchId);

  if (!batch) {
    return res.status(404).json({ message: "Batch not found" });
  }

  const processing = await Processing.create({
    batchId: batch._id,
    manufacturerId: req.user._id,
    processCode: req.body.processing?.processCode,
    formulationName: req.body.processing?.formulationName,
    packagingStatus: req.body.processing?.packagingStatus,
    notes: req.body.notes
  });

  batch.events.push({
    stage: "Manufacturing",
    actor: req.user.name,
    location: req.body.location || "Manufacturing Unit",
    notes: req.body.notes,
    metrics: {
      temperatureCelsius: req.body.temperatureCelsius,
      humidityPercent: req.body.humidityPercent
    }
  });
  batch.currentStage = "Manufacturing";
  batch.processingIds.push(processing._id);
  await batch.save();

  return res.status(201).json({ item: processing });
}

export async function getManufacturerDashboard(req, res) {
  const items = await Batch.find({
    $or: [
      {
        currentStage: "Testing",
        "qualityMetrics.overallScore": { $gte: 85 }
      },
      {
        currentStage: "Manufacturing"
      }
    ]
  })
    .sort({ updatedAt: -1 })
    .lean();
  return res.json({ items });
}
