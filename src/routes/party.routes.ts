import { Router } from "express";
import { createParty } from "../controllers/party.controller";
import { protect } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../models/User.model";

const router = Router();

router.post(
  "/",
  protect,
  requireRole([UserRole.ADMIN, UserRole.SUPERVISOR]),
  createParty
);

export default router;