import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { authLimiter } from "../middlewares/authLimiter.middleware";
import { requestChangeEmailOtp, verifyChangeEmailOtp, changePassword } from '../controllers/account.controller';

const router = Router();
// router.use(authLimiter);
router.post(
    "/change-email",
    protect,
    requestChangeEmailOtp
);

router.post(
    "/change-email/verify",
    protect,
    verifyChangeEmailOtp
);

router.put(
    "/change-password",
    protect,
    changePassword
);
export default router;
