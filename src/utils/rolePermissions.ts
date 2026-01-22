// utils/rolePermissions.ts
import { UserRole } from "../models/User.model";

export const CAN_CREATE: Record<UserRole, UserRole[]> = {
  ADMIN: [UserRole.SUB_ADMIN, UserRole.SUPERVISOR, UserRole.WORKER],
  SUB_ADMIN: [], // optional: decide later
  SUPERVISOR: [UserRole.WORKER],
  WORKER: [],
};
