import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import Notification from "../models/Notification.model";

/* ================= GET NOTIFICATIONS ================= */
export const getNotifications = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const notifications = await Notification.find({
    $or: [
      { role: "ALL" },
      { role: user.role },
      { user: user._id },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(50);

  return sendSuccess(res, notifications, 200, "Notifications fetched");
};
