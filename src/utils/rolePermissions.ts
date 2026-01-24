import { UserRole } from "../models/User.model";

export const CAN_CREATE: Record<UserRole, UserRole[]> = {
  ADMIN: [
    UserRole.SUB_ADMIN,
    UserRole.SUPERVISOR,
    UserRole.WORKER,
    UserRole.VENDOR,
  ],

  SUB_ADMIN: [], // blocked but can enable later

  SUPERVISOR: [
    UserRole.WORKER,
  ],

  WORKER: [],
  VENDOR: [],
};
