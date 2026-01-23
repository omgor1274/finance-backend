import { Router } from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
} from "../controllers/vendor.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/vendors", protect, createVendor);
router.get("/vendors", protect, getVendors);
router.get("/vendors/:id", protect, getVendorById);
router.put("/vendors/:id", protect, updateVendor);

export default router;
