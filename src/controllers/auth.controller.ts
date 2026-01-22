import User from "../models/User.model";
import { Request, Response } from "express";
import { generateToken } from "../services/token.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { createOtp, verifyOtp } from "../services/otp.service";
import { sendForgotPasswordOtpMail } from "../services/mail.service";
import Otp from "../models/Otp.model";
import { OtpPurpose } from "../models/Otp.model";

/* utils */
import { isValidEmail, isValidPassword } from "../validators/auth.validator";


/* ===================== LOGIN ===================== */
import { UserRole } from "../models/User.model";

export const login = async (req: Request, res: Response) => {
  if (!req.body) {
    return sendError(res, 400, "This field is required.");
  }

  const { email, password, role } = req.body;

  //  Email validation
  if (!email) {
    return sendError(res, 400, "This field is required.");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Enter a valid email address.");
  }

  //  Password validation
  if (!password) {
    return sendError(res, 400, "This field is required.");
  }

  //  Role validation (optional but recommended)
  if (!role) {
    return sendError(res, 400, "Role is required.");
  }

  const validRoles = Object.values(UserRole);
  if (!validRoles.includes(role)) {
    return sendError(res, 400, "Invalid role.");
  }

  //  Find user
  const user = await User.findOne({ email });

  if (!user) {
    return sendError(res, 404, "Email address not registered.");
  }

  //  Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 400, "Incorrect password. Try again.");
  }

  //  Role match check (IMPORTANT SECURITY)
  if (user.role !== role) {
    return sendError(res, 403, "Access denied for this role.");
  }

  // Generate token with role
  const token = generateToken(
    user._id.toString(),
    user.role
  );

  return sendSuccess(res, { token, role: user.role }, 200, "Login successful");
};


/* ===================== FORGOT PASSWORD ===================== */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body || {};

  if (!email) {
    return sendError(res, 400, "This field is required.");
  }
  if (!isValidEmail(email)) {
    return sendError(res, 400, "Enter a valid email address.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return sendError(res, 404, "Email address not registered.");
  }

  const otpData = await createOtp(email, OtpPurpose.FORGOT_PASSWORD);

  await sendForgotPasswordOtpMail(email, otpData.otp);


  return sendSuccess(res, null, 200, "OTP sent to email");
};

/* ===================== VERIFY OTP ===================== */
export const verifyForgotOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body || {};
  console.log(email, otp);

  if (!email) {
    return sendError(res, 400, "Email field is required.");
  }
  if (!otp) {
    return sendError(res, 400, "OTP field is required.");
  }

  const valid = await verifyOtp(email, otp, OtpPurpose.FORGOT_PASSWORD);
  if (!valid) {
    return sendError(res, 400, "Invalid or expired OTP");
  }

  return sendSuccess(res, null, 200, "OTP verified");
};

/* ===================== RESET PASSWORD ===================== */


export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword } = req.body || {};

  if (!newPassword || !confirmPassword) {
    return sendError(res, 400, "This field is required.");
  }

  if (newPassword !== confirmPassword) {
    return sendError(res, 400, "Passwords do not match.");
  }

  const otpRecord = await Otp.findOne({
    email,
    purpose: "FORGOT_PASSWORD",
    isVerified: true,
    isUsed: false
  });

  if (!otpRecord) {
    return sendError(
      res,
      403,
      "OTP verification required before resetting password."
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return sendError(res, 404, "User not found");
  }

  if (!isValidPassword(newPassword)) {
    return sendError(
      res,
      400,
      "Password must be at least 6 characters long and include a number and special character."
    );
  }


  user.password = newPassword;
  await user.save();


  otpRecord.isUsed = true;
  await otpRecord.save();

  return sendSuccess(res, null, 200, "Password updated successfully");
};
