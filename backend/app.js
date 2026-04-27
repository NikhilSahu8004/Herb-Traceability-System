import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/db.js";
import { batchRoutes } from "./routes/batchRoutes.js";
import { farmerRoutes } from "./routes/farmerRoutes.js";
import { labRoutes } from "./routes/labRoutes.js";
import { manufacturerRoutes } from "./routes/manufacturerRoutes.js";
import { User } from "./models/User.js";
import { Batch } from "./models/Batch.js";
import { createMockStore } from "./services/mockStore.js";

dotenv.config({
  path: new URL("../.env", import.meta.url)
});

const app = express();
const port = process.env.PORT || 5001;
const mongoUri = process.env.MONGODB_URI;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());
app.locals.mockMode = false;
app.locals.mockStore = null;

app.use("/api", batchRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/manufacturer", manufacturerRoutes);

async function seedDefaults() {
  if ((await User.countDocuments()) === 0) {
    await User.insertMany([
      {
        name: "Nikhil Farmer",
        email: "farmer@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        role: "Farmer"
      },
      {
        name: "Quality Lab",
        email: "lab@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        role: "Lab"
      },
      {
        name: "Manufacturer Unit",
        email: "manufacturer@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        role: "Manufacturer"
      }
    ]);
  }

  if ((await Batch.countDocuments()) === 0) {
    const farmer = await User.findOne({ role: "Farmer" }).lean();
    await Batch.create({
      batchCode: "BTH-ASH-2026-001",
      herbName: "Ashwagandha",
      botanicalName: "Withania somnifera",
      farmerId: farmer?._id,
      collectorName: farmer?.name || "Nikhil Farmer",
      sourceType: "Cultivated",
      quantityKg: 120,
      harvestDate: new Date("2026-04-10"),
      origin: {
        region: "Dhar, Madhya Pradesh",
        geo: {
          latitude: 22.6013,
          longitude: 75.3025
        }
      },
      compliance: {
        ayush: true,
        certificateStatus: "Verified"
      },
      events: [
        {
          stage: "Collection",
          actor: farmer?.name || "Nikhil Farmer",
          location: "Dhar, Madhya Pradesh",
          notes: "Initial harvest recorded with geo-tagged origin."
        }
      ],
      qrCodeData: JSON.stringify({
        batchCode: "BTH-ASH-2026-001",
        herbName: "Ashwagandha",
        region: "Dhar, Madhya Pradesh"
      })
    });
  }
}

async function start() {
  if (!mongoUri) {
    app.locals.mockMode = true;
    app.locals.mockStore = await createMockStore();
    app.listen(port, () => {
      console.log(`API listening in mock mode on http://localhost:${port}`);
    });
    return;
  }

  try {
    await connectDatabase(mongoUri);
    await seedDefaults();
  } catch (error) {
    console.warn("Database unavailable, starting mock mode instead.");
    console.warn(error.message);
    app.locals.mockMode = true;
    app.locals.mockStore = await createMockStore();
  }

  app.listen(port, () => {
    console.log(
      `API listening${app.locals.mockMode ? " in mock mode" : ""} on http://localhost:${port}`
    );
  });
}

start().catch((error) => {
  console.error("Failed to start server");
  console.error(error);
  process.exit(1);
});
