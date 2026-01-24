import { Router } from "express";
import {
    createFund,
    getFunds,
    getFundById,
} from "../controllers/funds.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { Permission } from "../constants/permissions";

const router = Router();

// ➕ Create fund
router.post(
    "/",
    protect,
    requirePermission(Permission.FUNDS),
    createFund
);

// 📄 Get fund list
router.get(
    "/",
    protect,
    requirePermission(Permission.FUNDS),
    getFunds
);

// 🔍 Get fund detail
router.get(
    "/:id",
    protect,
    requirePermission(Permission.FUNDS),
    getFundById
);

export default router;
