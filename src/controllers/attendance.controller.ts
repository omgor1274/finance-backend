import { Request, Response } from "express";
import User, { UserRole } from "../models/User.model";
import { sendSuccess, sendError } from "../utils/apiResponse";
import Attendance, { AttendanceStatus } from "../models/Attendance.model";

/**
 * 🔍 Search users for attendance
 */
export const searchUsersForAttendance = async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q) return sendSuccess(res, [], 200, "No query");

    const users = await User.find({
        role: UserRole.WORKER,
        $or: [
            { userCode: { $regex: q as string, $options: "i" } },
            { firstName: { $regex: q as string, $options: "i" } },
            { lastName: { $regex: q as string, $options: "i" } },
        ],
    }).select("userCode firstName lastName role");

    const result = users.map((u) => ({
        userCode: u.userCode,
        userName: `${u.firstName} ${u.lastName}`,
        role: u.role,
    }));

    return sendSuccess(res, result, 200, "Users fetched");
};

/**
 * ✅ Mark / Update attendance
 */
export const markAttendance = async (req: Request, res: Response) => {
    const authUser = (req as any).user;

    const {
        userCode,
        date,
        location,
        status,
        inTime,
        outTime,
        workingHours,
        remarks,
    } = req.body;

    if (!userCode || !date || !location || !status) {
        return sendError(res, 400, "Invalid payload");
    }

    // 🔐 Location permission
    if (
        authUser.role !== UserRole.ADMIN &&
        !authUser.assignedLocations?.includes(location)
    ) {
        return sendError(res, 403, "Location access denied");
    }

    const user = await User.findOne({ userCode });
    if (!user) return sendError(res, 404, "User not found");

    const attendance = await Attendance.findOneAndUpdate(
        { userId: user._id, date, location },
        {
            userId: user._id,
            userCode: user.userCode,
            userName: `${user.firstName} ${user.lastName}`,
            role: user.role,
            date,
            location,
            status,
            inTime,
            outTime,
            workingHours,
            remarks,
            markedBy: authUser._id,
        },
        { upsert: true, new: true }
    );

    return sendSuccess(res, attendance, 200, "Attendance saved");
};

/**
 * 📅 Get attendance list (UI table)
 */
export const getAttendanceByDateAndLocation = async (
    req: Request,
    res: Response
) => {
    const authUser = (req as any).user;
    const { date, location } = req.query;

    if (!date || !location) {
        return sendError(res, 400, "Date and location required");
    }

    if (
        authUser.role !== UserRole.ADMIN &&
        !authUser.assignedLocations?.includes(location)
    ) {
        return sendError(res, 403, "Location access denied");
    }

    const records = await Attendance.find({ date, location }).sort({
        userCode: 1,
    });

    return sendSuccess(res, records, 200, "Attendance fetched");
};
