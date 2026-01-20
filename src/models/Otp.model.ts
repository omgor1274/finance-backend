import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  purpose: "FORGOT_PASSWORD";
  expiresAt: Date;
  isVerified: boolean;
  isUsed: boolean;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  isUsed: { type: Boolean, default: false }
});

export default mongoose.model<IOtp>("Otp", otpSchema);
