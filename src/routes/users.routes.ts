import { Router } from "express";
import { protect } from '../middlewares/auth.middleware';
import { uploadUserImage } from "../middlewares/uploadUserImage.middleware";
import { createUser } from "../controllers/users.controller";

const router = Router();




router.post(
    "/users",
    protect,
    uploadUserImage.single("profileImage"),
    createUser
);
export default router
