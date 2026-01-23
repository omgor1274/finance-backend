import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAttendanceEntry {
    worker: Types.ObjectId;      // User (WORKER)
    workerCode: string;          // W001
    slots: number[];             // [1, 2, 3]
}

export interface IAttendance extends Document {
    date: string;                // YYYY-MM-DD
    site: Types.ObjectId;         // Location / Site
    entries: IAttendanceEntry[];
    markedBy: Types.ObjectId;     // Admin / Supervisor
    createdAt: Date;
    updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
    {
        date: {
            type: String,
            required: true,
            index: true,
        },

        site: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true,
            index: true,
        },

        entries: [
            {
                worker: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                workerCode: {
                    type: String,
                    required: true,
                },
                slots: {
                    type: [Number], // e.g. [1,2,3]
                    default: [],
                },
            },
        ],

        markedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// One attendance per date + site
attendanceSchema.index({ date: 1, site: 1 }, { unique: true });

export default mongoose.model<IAttendance>(
    "Attendance",
    attendanceSchema
);
