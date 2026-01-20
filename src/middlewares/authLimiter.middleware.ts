import rateLimit from "express-rate-limit";
import { sendError } from "../utils/apiResponse";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 attempts
  handler: (req, res) => {
    return sendError(
      res,
      429,
      "Too many attempts. Please try again later."
    );
  }
});
