import { Router } from "express";
import { globalSearch } from "../controllers/search.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, globalSearch);

export default router;
