import { Router } from "express";
import { protect } from '../middlewares/auth.middleware';
import { uploadUserImage } from "../middlewares/uploadUserImage.middleware";
import {
    createUser, getUser,
    updateUserByKey
} from "../controllers/users.controller";

const router = Router();

router.post(
    "/users",
    protect,
    uploadUserImage.single("profileImage"),
    createUser
);
router.get("/users", protect, getUser);

router.put(
    "/users",
    protect,
    uploadUserImage.single("profileImage"),
    updateUserByKey
);
export default router

