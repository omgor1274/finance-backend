import { Router } from "express";
import { dashboard } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../models/User.model";

const router = Router();

router.get("/dashboard", protect, requireRole([UserRole.ADMIN, UserRole.SUPERVISOR]), dashboard);

export default router;
