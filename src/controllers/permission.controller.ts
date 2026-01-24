import { Request, Response } from "express";
import { UserRole } from "../models/User.model";
import RolePermission from "../models/Permission.model";
import { sendSuccess, sendError } from "../utils/apiResponse";

/**
 * Get permissions for a role
 */
export const getRolePermissions = async (req: Request, res: Response) => {
  const { role } = req.params;

  const data = await RolePermission.findOne({ role });

  return sendSuccess(res, data, 200, "Permissions fetched");
};

/**
 * Update permissions for a role
 * Only ADMIN allowed
 */
export const updateRolePermissions = async (req: Request, res: Response) => {
  const authUser = (req as any).user;

  if (authUser.role !== UserRole.ADMIN) {
    return sendError(res, 403, "Only admin can manage permissions");
  }

  const { role, permissions } = req.body;

  if (!role || !Array.isArray(permissions)) {
    return sendError(res, 400, "Invalid payload");
  }

  const updated = await RolePermission.findOneAndUpdate(
    { role },
    { permissions },
    { upsert: true, new: true }
  );

  return sendSuccess(res, updated, 200, "Permissions updated");
};