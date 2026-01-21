import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";
import { UserRole } from "../models/User.model";

export const requireRole =
  (allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, "Access denied");
    }

    next();
  };
