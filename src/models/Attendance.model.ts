import mongoose, { Schema, Document, Types } from "mongoose";

export enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    HALF_DAY = "HALF_DAY",
    LEAVE = "LEAVE",
}

export interface IAttendance extends Document {
    userId: Types.ObjectId;

    // UI visible fields
    userCode: string;          // W001
    userName: string;          // Vinod Patel
    role: string;              // WORKER
    location: String;

    // Attendance data
    date: string;              // YYYY-MM-DD
    status: AttendanceStatus;
    inTime?: string;           // 09:30
    outTime?: string;          // 18:00
    workingHours?: number;     // 8.5
    remarks?: string;

    // Audit
    markedBy: Types.ObjectId;
}

const attendanceSchema = new Schema<IAttendance>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        userCode: {
            type: String,
            required: true,
            index: true,
        },

        userName: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            ref: "Location",
            required: true,
            index: true,
        },

        date: {
            type: String,
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: Object.values(AttendanceStatus),
            required: true,
        },

        inTime: {
            type: String, // HH:mm
        },

        outTime: {
            type: String, // HH:mm
        },

        workingHours: {
            type: Number,
        },

        remarks: {
            type: String,
            trim: true,
        },

        markedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// 🔒 One attendance per user per date per location
attendanceSchema.index(
    { userId: 1, date: 1, location: 1 },
    { unique: true }
);

export default mongoose.model<IAttendance>("Attendance", attendanceSchema);
