import User from "../models/User.model";
import { Request, Response } from "express";
import { generateToken } from "../services/token.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { createOtp, verifyOtp } from "../services/otp.service";
import { sendForgotPasswordOtpMail } from "../services/mail.service";
import Otp from "../models/Otp.model";

/* utils */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;

/* ===================== LOGIN ===================== */
export const login = async (req: Request, res: Response) => {
  if (!req.body) {
    return sendError(res, 400, "This field is required.");
  }

  const { email, password } = req.body;

  
  if (!email) {
    return sendError(res, 400, "This field is required.");
  }


  if (!emailRegex.test(email)) {
    return sendError(res, 400, "Enter a valid email address.");
  }

  
  if (!password) {
    return sendError(res, 400, "This field is required.");
  }

  const user = await User.findOne({ email });


  if (!user) {
    return sendError(res, 404, "Email address not registered.");
  }


  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 400, "Incorrect password. Try again.");
  }

  const token = generateToken(user._id.toString());

  return sendSuccess(res, { token }, 200, "Login successful");
};

/* ===================== FORGOT PASSWORD ===================== */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body || {};

  if (!email) {
    return sendError(res, 400, "This field is required.");
  }
  if (!emailRegex.test(email)) {
    return sendError(res, 400, "Enter a valid email address.");
  }
  const user = await User.findOne({ email });
 
  if (!user) {
    return sendError(res, 404, "Email address not registered.");
  }
 
  const otpData = await createOtp(email, "FORGOT_PASSWORD");

  await sendForgotPasswordOtpMail(email, otpData.otp);


  return sendSuccess(res, null, 200, "OTP sent to email");
};

/* ===================== VERIFY OTP ===================== */
export const verifyForgotOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body || {};
  if (!otp) {
    return sendError(res, 400, "This field is required.");
  }

  const valid = await verifyOtp(email, otp, "FORGOT_PASSWORD");
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

  user.password = newPassword;
  await user.save();
  

  otpRecord.isUsed = true;
  await otpRecord.save();

  return sendSuccess(res, null, 200, "Password updated successfully");
};
