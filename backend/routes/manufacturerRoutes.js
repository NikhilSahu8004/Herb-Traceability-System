import { Router } from "express";
import {
  addProcessingStep,
  getManufacturerDashboard
} from "../controllers/manufacturerController.js";
import { requireAuth, requireRole } from "../services/authService.js";

export const manufacturerRoutes = Router();

manufacturerRoutes.get(
  "/dashboard",
  requireAuth,
  requireRole("Manufacturer"),
  getManufacturerDashboard
);
manufacturerRoutes.post(
  "/batches/:batchId/process",
  requireAuth,
  requireRole("Manufacturer"),
  addProcessingStep
);
