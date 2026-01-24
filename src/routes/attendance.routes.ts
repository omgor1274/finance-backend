import { Router } from "express";
import {
  searchUsersForAttendance,
  markAttendance,
  getAttendanceByDateAndLocation,
} from "../controllers/attendance.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { Permission } from "../constants/permissions";

const router = Router();

// 🔍 Worker search (UI search bar)
router.get(
  "/users/search",
  protect,
  requirePermission(Permission.ATTENDANCE),
  searchUsersForAttendance
);

// ✅ Save attendance (Present / Absent / Half day)
router.post(
  "/mark",
  protect,
  requirePermission(Permission.ATTENDANCE),
  markAttendance
);

// 📅 Attendance list screen
router.get(
  "/",
  protect,
  requirePermission(Permission.ATTENDANCE),
  getAttendanceByDateAndLocation
);

export default router;
