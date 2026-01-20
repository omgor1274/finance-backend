import Otp from "../models/Otp.model";

export const createOtp = async (
  email: string,
  purpose: "FORGOT_PASSWORD"
) => {
  await Otp.deleteMany({ email, purpose });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 min

  const record = await Otp.create({
    email,
    otp,
    purpose,
    expiresAt,
    isVerified: false,
    isUsed: false
  });

  return record;
};

export const verifyOtp = async (
  email: string,
  otp: string,
  purpose: "FORGOT_PASSWORD"
): Promise<boolean> => {
  const record = await Otp.findOne({
    email,
    otp,
    purpose,
    isUsed: false
  });

  if (!record) return false;

  if (record.expiresAt < new Date()) return false;

  record.isVerified = true;
  await record.save();

  return true;
};
