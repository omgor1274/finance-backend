import { Request, Response } from "express";
import Attendance from "../models/Attendance.model";
import User, { UserRole } from "../models/User.model";
import { sendError, sendSuccess } from "../utils/apiResponse";


/* ================= GET ATTENDANCE ================= */
export const getAttendance = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (![UserRole.ADMIN].includes(user.role)) {
        return sendError(res, 403, "Not allowed");
    }

    const { date, site } = req.query;
    if (!date || !site) {
        return sendError(res, 400, "Date and site are required");
    }

    const attendance = await Attendance.findOne({ date, site })
        .populate("entries.worker", "firstName lastName userCode profileImage");

    return sendSuccess(
        res,
        attendance || { entries: [] },
        200,
        "Attendance fetched"
    );
};


/* ================= MARK ATTENDANCE ================= */
export const markAttendance = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (![UserRole.ADMIN].includes(user.role)) {
        return sendError(res, 403, "Not allowed");
    }

    const { date, site, workerId, slot } = req.body;

    if (!date || !site || !workerId || !slot) {
        return sendError(res, 400, "Required fields missing");
    }

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== UserRole.WORKER) {
        return sendError(res, 404, "Worker not found");
    }

    const attendance = await Attendance.findOneAndUpdate(
        { date, site },
        { $setOnInsert: { date, site, markedBy: user._id } },
        { upsert: true, new: true }
    );

    const entry = attendance.entries.find(
        e => e.worker.toString() === workerId
    );

    if (entry) {
        if (!entry.slots.includes(slot)) {
            entry.slots.push(slot);
        }
    } else {
        attendance.entries.push({
            worker: worker._id,
            workerCode: worker.userCode!,
            slots: [slot],
        });
    }

    await attendance.save();

    return sendSuccess(res, attendance, 200, "Attendance marked");
};

/* ================= REMOVE SLOT ================= */
export const removeAttendanceSlot = async (req: Request, res: Response) => {
    const { date, site, workerId, slot, user } = req.body;

    if (![UserRole.ADMIN].includes(user.role)) {
        return sendError(res, 403, "Not allowed");
    }

    const attendance = await Attendance.findOne({ date, site });
    if (!attendance) {
        return sendError(res, 404, "Attendance not found");
    }

    const entry = attendance.entries.find(
        e => e.worker.toString() === workerId
    );

    if (!entry) {
        return sendError(res, 404, "Worker entry not found");
    }

    entry.slots = entry.slots.filter(s => s !== slot);
    await attendance.save();

    return sendSuccess(res, attendance, 200, "Attendance updated");
};

/* ================= SEARCH WORKERS ================= */
export const searchWorkers = async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (![UserRole.ADMIN].includes(user.role)) {
        return sendError(res, 403, "Not allowed");
    }

    const q = (req.query.q as string)?.trim();

    if (!q) {
        return sendSuccess(res, [], 200, "No query");
    }

    const regex = new RegExp(q, "i");
    

    const workers = await User.find({
        role: UserRole.WORKER,
        $or: [
            { firstName: regex },
            { lastName: regex },
            { userCode: regex },
        ],

    }).select("firstName lastName userCode profileImage");

    return sendSuccess(res, workers, 200, "Workers found");
};

