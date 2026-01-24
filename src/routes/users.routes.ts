import { Router } from "express";
import { protect } from '../middlewares/auth.middleware';
import { uploadUserImage } from "../middlewares/uploadUserImage.middleware";
import {
    createUser, getUser,
    updateUserByKey
} from "../controllers/users.controller";

const router = Router();

router.post(
    "/",
    protect,
    uploadUserImage.single("profileImage"),
    createUser
);
router.get("/", protect, getUser);

router.put(
    "/",
    protect,
    uploadUserImage.single("profileImage"),
    updateUserByKey
);
export default router

