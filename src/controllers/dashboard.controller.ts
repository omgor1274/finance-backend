import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { UserRole } from "../models/User.model";

// TEMP placeholders (we'll replace with real models later)
const getAdminDashboardData = async () => {
    return {
        totalBalance: 120000,
        totalInvoices: 230,
        totalTransactions: 542,
        locations: 12,
    };
};

const getSupervisorDashboardData = async (userId: string) => {
    return {
        attendanceToday: true,
        recentTransactions: 18,
        assignedLocations: 2,
    };
};

export const dashboard = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return sendError(res, 401, "Unauthorized");
        }

        if (req.user.role === UserRole.ADMIN) {
            const data = await getAdminDashboardData();
            return sendSuccess(res, data, 200, "Admin dashboard data");
        }

        if (req.user.role === UserRole.SUPERVISOR) {
            const data = await getSupervisorDashboardData(req.user._id.toString());
            return sendSuccess(res, data, 200, "Supervisor dashboard data");
        }

        return sendError(res, 403, "Access denied");
    } catch (error) {
        return sendError(res, 500, "Failed to load dashboard");
    }
};
