import Otp, { OtpPurpose } from "../models/Otp.model";

export const createOtp = async (
  email: string,
  purpose: OtpPurpose
) => {
  await Otp.deleteMany({ email, purpose });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  const record = await Otp.create({
    email,
    otp,
    purpose,
    expiresAt,
    isVerified: false,
    isUsed: false,
  });

  return record;
};

export const verifyOtp = async (
  email: string,
  otp: string,
  purpose: OtpPurpose
): Promise<boolean> => {

  otp = otp.toString().trim();

  const record = await Otp.findOne({
    email,
    otp,
    purpose,
    isUsed: false,
  });

  if (!record) return false;

  if (record.expiresAt.getTime() < Date.now()) return false;

  record.isVerified = true;
  record.isUsed = true;
  await record.save();

  return true;
};

