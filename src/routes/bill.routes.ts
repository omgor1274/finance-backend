import { Router } from "express";
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} from "../controllers/bill.controller";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware"; 
import { requirePermission } from "../middlewares/permission.middleware";
import { Permission } from "../constants/permissions";


const router = Router();

router.post(
  "/bills",
  protect,
  requirePermission(Permission.BILLS),
  upload.single("attachment"),
  createBill
);

router.put(
  "/bills/:id",
  protect,
  requirePermission(Permission.BILLS),
  upload.single("attachment"),
  updateBill
);

router.get("/bills", protect,requirePermission(Permission.BILLS), getBills);
router.get("/bills/:id", protect,requirePermission(Permission.BILLS), getBillById);


export default router;
