import { Router } from "express";
import { getNotifications } from "../controllers/notification.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/notifications", protect, getNotifications);

export default router;
