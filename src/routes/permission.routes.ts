import { Router } from "express";
import {
    getRolePermissions,
    updateRolePermissions,
} from "../controllers/permission.controller";
import { protect } from "../middlewares/auth.middleware";
import { UserRole } from "../models/User.model";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/:role", protect, requireRole([UserRole.ADMIN]), getRolePermissions);
router.post("/", protect, requireRole([UserRole.ADMIN]), updateRolePermissions);

export default router;
