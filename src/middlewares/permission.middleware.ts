import { Request, Response, NextFunction } from "express";
import RolePermission from "../models/Permission.model";
import { Permission } from "../constants/permissions";

export const requirePermission = (permission: Permission) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 🔥 ADMIN can access everything
        if (user.role === "ADMIN") {
            return next();
        }

        const rolePermission = await RolePermission.findOne({
            role: user.role,
        });

        if (!rolePermission) {
            return res.status(403).json({
                message: "Permission denied",
            });
        }

        if (!rolePermission.permissions.includes(permission)) {
            return res.status(403).json({
                message: "Permission denied",
            });
        }

        next();
    };
};
