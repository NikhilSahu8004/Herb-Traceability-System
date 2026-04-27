import bcrypt from "bcryptjs";

function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeBatch(batch) {
  return {
    ...batch,
    _id: batch._id || makeId("batch"),
    currentStage: batch.currentStage || "Collection",
    blockchain: batch.blockchain || {
      network: "Simulated Ledger",
      isAnchored: true,
      status: "Ready",
      txHash: "",
      anchoredAt: null,
      anchorNotes: "Awaiting next traceability checkpoint."
    },
    analytics: batch.analytics || {
      verificationScore: 88
    },
    qualityMetrics: batch.qualityMetrics || {
      overallScore: 88,
      purityPercent: 93,
      moisturePercent: 9
    },
    compliance: batch.compliance || {
      ayush: false,
      certificateStatus: "Pending"
    },
    events: batch.events || [],
    labReports: batch.labReports || [],
    processingLog: batch.processingLog || [],
    auditLog: batch.auditLog || []
  };
}

export async function createMockStore() {
  const users = [
    {
      _id: "user_farmer_1",
      name: "Nikhil Farmer",
      email: "farmer@example.com",
      role: "Farmer",
      passwordHash: await bcrypt.hash("password123", 10)
    },
    {
      _id: "user_lab_1",
      name: "Quality Lab",
      email: "lab@example.com",
      role: "Lab",
      passwordHash: await bcrypt.hash("password123", 10)
    },
    {
      _id: "user_manufacturer_1",
      name: "Manufacturer Unit",
      email: "manufacturer@example.com",
      role: "Manufacturer",
      passwordHash: await bcrypt.hash("password123", 10)
    }
  ];

  const batches = [];

  return {
    users,
    batches,
    findUserByEmail(email) {
      return users.find((user) => user.email === email.toLowerCase()) || null;
    },
    findUserById(id) {
      return users.find((user) => user._id === id) || null;
    },
    createUser({ name, email, role, passwordHash, farmLocation }) {
      const user = {
        _id: makeId("user"),
        name,
        email: email.toLowerCase(),
        role,
        farmLocation,
        passwordHash
      };
      users.push(user);
      return user;
    },
    listBatches() {
      return [...batches].reverse();
    },
    findBatchById(id) {
      return batches.find((batch) => batch._id === id) || null;
    },
    findBatchByCode(batchCode) {
      return batches.find((batch) => batch.batchCode === batchCode.toUpperCase()) || null;
    },
    createBatch(batch) {
      const item = normalizeBatch({
        ...batch,
        _id: makeId("batch")
      });
      batches.push(item);
      return item;
    },
    deleteBatch(batchId) {
      const index = batches.findIndex((batch) => batch._id === batchId);
      if (index === -1) {
        return null;
      }

      const [deleted] = batches.splice(index, 1);
      return deleted;
    },
    addBatchEvent(batchId, event) {
      const batch = this.findBatchById(batchId);
      if (!batch) {
        return null;
      }

      const nextEvent = {
        _id: makeId("event"),
        ...event,
        createdAt: new Date().toISOString()
      };

      batch.events.push(nextEvent);
      batch.currentStage = event.stage;

      if (event.labReport) {
        batch.labReports.push({
          _id: makeId("lab"),
          ...event.labReport,
          labName: event.actor,
          notes: event.notes,
          createdAt: nextEvent.createdAt
        });
        batch.qualityMetrics.purityPercent = event.labReport.purityPercent;
        batch.qualityMetrics.moisturePercent = event.labReport.moisturePercent;
        batch.qualityMetrics.overallScore =
          event.labReport.result === "Pass" ? 95 : event.labReport.result === "Review" ? 78 : 58;
        batch.analytics.verificationScore = batch.qualityMetrics.overallScore;
        batch.compliance.ayush = event.labReport.result === "Pass";
        batch.compliance.certificateStatus =
          event.labReport.result === "Pass" ? "Verified" : event.labReport.result;
        batch.blockchain.status =
          event.labReport.result === "Pass" ? "Ready for anchoring" : "Verification hold";
        batch.auditLog.push({
          _id: makeId("audit"),
          action: "Lab report uploaded",
          actor: event.actor,
          role: event.actorRole,
          summary: `${event.labReport.reportId} recorded a ${event.labReport.result} result.`,
          createdAt: nextEvent.createdAt
        });
      }

      if (event.processing) {
        batch.processingLog.push({
          _id: makeId("proc"),
          ...event.processing,
          manufacturerName: event.actor,
          notes: event.notes,
          createdAt: nextEvent.createdAt
        });
        batch.blockchain = {
          ...batch.blockchain,
          isAnchored: true,
          status: "Anchored",
          txHash: `0x${`${batch.batchCode}${event.processing.processCode}`.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 32).padEnd(32, "0")}`,
          anchoredAt: nextEvent.createdAt,
          anchorNotes: `Manufacturing checkpoint anchored for ${event.processing.processCode}.`
        };
        batch.auditLog.push({
          _id: makeId("audit"),
          action: "Manufacturing update",
          actor: event.actor,
          role: event.actorRole,
          summary: `${event.processing.processCode} moved to ${event.processing.packagingStatus}.`,
          createdAt: nextEvent.createdAt
        });
      }

      if (!event.labReport && !event.processing) {
        batch.auditLog.push({
          _id: makeId("audit"),
          action: "Stage updated",
          actor: event.actor,
          role: event.actorRole,
          summary: `${batch.batchCode} moved to ${event.stage}.`,
          createdAt: nextEvent.createdAt
        });
      }

      return batch;
    }
  };
}
