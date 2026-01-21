import mongoose, { Schema, Document, Types } from "mongoose";
import { UserRole } from "./User.model";

export interface INotification extends Document {
  title: string;
  message: string;
  role: UserRole | "ALL";
  user?: Types.ObjectId; // optional (for user-specific notifications)
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "SUPERVISOR", "ALL"],
      default: "ALL",
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
