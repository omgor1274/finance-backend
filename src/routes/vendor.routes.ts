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

router.post("/", protect, requirePermission(Permission.VENDORS), createVendor);
router.get("/", protect, getVendors);
router.get("/:id", protect, getVendorById);
router.put("/:id", protect, requirePermission(Permission.VENDORS), updateVendor);

export default router;
