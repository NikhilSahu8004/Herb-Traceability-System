import { Batch } from "../models/Batch.js";
import { qrService } from "../services/qrService.js";

export async function registerBatch(req, res) {
  const batch = await Batch.create({
    batchCode: req.body.batchCode,
    herbName: req.body.herbName,
    botanicalName: req.body.botanicalName,
    collectorName: req.user.name,
    farmerId: req.user._id,
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
      ayush: Boolean(req.body.ayushCompliance),
      certificateStatus: req.body.ayushCompliance ? "Submitted" : "Pending"
    },
    events: [
      {
        stage: "Collection",
        actor: req.user.name,
        location: req.body.region,
        notes: `Collection created by ${req.user.name}.`
      }
    ],
    qrCodeData: qrService.makeTracePayload({
      batchCode: req.body.batchCode,
      herbName: req.body.herbName,
      region: req.body.region
    })
  });

  return res.status(201).json({ item: batch });
}

export async function getFarmerDashboard(req, res) {
  const items = await Batch.find({ farmerId: req.user._id }).sort({ createdAt: -1 }).lean();
  return res.json({ items });
}
