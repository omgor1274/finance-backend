import { Router } from "express";
import { downloadInvoiceReport } from "../controllers/report.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { Permission } from "../constants/permissions";

const router = Router();

/**
 * 📥 Download Invoice Report
 */
router.get(
    "/report",
    protect,
    requirePermission(Permission.INVOICE),
    downloadInvoiceReport
);

export default router;
