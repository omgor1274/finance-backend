import { Router } from "express";
import { createFund } from "../controllers/funds.controller";
import { protect } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../models/User.model";
import { upload } from "../middlewares/upload.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { Permission } from "../constants/permissions";

const router = Router();

router.post(
    "/admin/funds",
    protect,
    requirePermission(Permission.BANK_ACCOUNT),
    upload.single("attachment"),
    createFund
);

export default router;