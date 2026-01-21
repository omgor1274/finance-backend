import mongoose, { Schema, Document } from "mongoose";

export type OtpPurpose = "FORGOT_PASSWORD";

export interface IOtp extends Document {
  email: string;
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

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["FORGOT_PASSWORD"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, 
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
