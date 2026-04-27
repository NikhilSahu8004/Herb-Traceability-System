import { Router } from "express";
import {
  addBatchEvent,
  createBatch,
  deleteBatch,
  getAllBatches,
  getBatchById,
  getBatchQr,
  getDashboard,
  verifyBatch
} from "../controllers/batchController.js";
import { getSession, login, register } from "../controllers/authController.js";
import { requireAuth } from "../services/authService.js";

export const batchRoutes = Router();

batchRoutes.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

batchRoutes.post("/auth/register", register);
batchRoutes.post("/auth/login", login);
batchRoutes.get("/auth/me", requireAuth, getSession);

batchRoutes.get("/dashboard", requireAuth, getDashboard);
batchRoutes.get("/batches", requireAuth, getAllBatches);
batchRoutes.post("/batches", requireAuth, createBatch);
batchRoutes.get("/batches/:id", requireAuth, getBatchById);
batchRoutes.delete("/batches/:id", requireAuth, deleteBatch);
batchRoutes.post("/batches/:id/events", requireAuth, addBatchEvent);
batchRoutes.get("/batches/:id/qr", getBatchQr);
batchRoutes.get("/trace/:batchCode", verifyBatch);
