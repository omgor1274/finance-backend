import { Router } from "express";
import {
    getRolePermissions,
    updateRolePermissions,
} from "../controllers/permission.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:role", protect, getRolePermissions);
router.post("/", protect, updateRolePermissions);

export default router;
