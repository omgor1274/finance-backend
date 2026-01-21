import { Router } from "express";
import { createFund } from "../controllers/funds.controller";
import { protect } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../models/User.model";

const router = Router();

router.post(
    "/admin/funds",
    protect,
    requireRole([UserRole.ADMIN]),
    createFund
);

export default router;
