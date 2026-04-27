import { Router } from "express";
import { addLabReport, getLabDashboard } from "../controllers/labController.js";
import { requireAuth, requireRole } from "../services/authService.js";

export const labRoutes = Router();

labRoutes.get("/dashboard", requireAuth, requireRole("Lab"), getLabDashboard);
labRoutes.post("/batches/:batchId/report", requireAuth, requireRole("Lab"), addLabReport);
