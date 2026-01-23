import { Router } from "express";
import {
  getAttendance,
  markAttendance,
  removeAttendanceSlot,
  searchWorkers,
} from "../controllers/attendance.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/attendance", protect, getAttendance);
router.post("/attendance/mark", protect, markAttendance);
router.post("/attendance/remove-slot", protect, removeAttendanceSlot);
router.get("/attendance/workers", protect, searchWorkers);

export default router;
