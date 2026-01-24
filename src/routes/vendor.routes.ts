import { Router } from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
} from "../controllers/vendor.controller";
import { protect } from "../middlewares/auth.middleware";
import { Permission } from "../constants/permissions";
import { requirePermission } from "../middlewares/permission.middleware";

const router = Router();

router.post("/vendors", protect, requirePermission(Permission.VENDORS), createVendor);
router.get("/vendors", protect, getVendors);
router.get("/vendors/:id", protect, getVendorById);
router.put("/vendors/:id", protect, requirePermission(Permission.VENDORS), updateVendor);

export default router;
