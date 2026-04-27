import { Router } from "express";
import { getFarmerDashboard, registerBatch } from "../controllers/farmerController.js";
import { requireAuth, requireRole } from "../services/authService.js";

export const farmerRoutes = Router();

farmerRoutes.get("/dashboard", requireAuth, requireRole("Farmer"), getFarmerDashboard);
farmerRoutes.post("/batches", requireAuth, requireRole("Farmer"), registerBatch);
