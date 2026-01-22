import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import { authLimiter } from "../middlewares/authLimiter.middleware";

const router = Router();

// router.use(authLimiter);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.post("/verify-otp", auth.verifyForgotOtp);
router.post("/reset-password", auth.resetPassword);

export default router;
