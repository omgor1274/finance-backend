import mongoose, { Schema, Document } from "mongoose";

export enum OtpPurpose {
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  CHANGE_EMAIL = "CHANGE_EMAIL",
}

export interface IOtp extends Document {
  email: string;
  pendingEmail?: string;
  otp: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  isVerified: boolean;
  isUsed: boolean;
}

const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    pendingEmail: {
      type: String,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: Object.values(OtpPurpose),
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOtp>("Otp", otpSchema);
