import bcrypt from "bcryptjs";
import User from "../models/User.model";
import { Request, Response } from "express";
import { OtpPurpose } from "../models/Otp.model";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { createOtp, verifyOtp } from "../services/otp.service";
import { sendChangeEmailOtpMail } from "../services/mail.service";
import { isValidEmail, isValidPassword } from "../validators/auth.validator";

/* ================= UPDATE PROFILE ================= */

export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const update: any = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
    };

    if (req.file) {
        update.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        update,
        { new: true }
    ).select("-password");

    return sendSuccess(res, user, 200, "Profile updated");
};


/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, confirmPassword } = req.body || {};

    if (!oldPassword || !newPassword || !confirmPassword) {
        return sendError(res, 400, "All fields are required.");
    }

    if (newPassword !== confirmPassword) {
        return sendError(res, 400, "Passwords do not match.");
    }

    const user = await User.findById((req as any).user.id);

    if (!user) {
        return sendError(res, 404, "User not found.");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return sendError(res, 400, "Old password is incorrect.");
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, null, 200, "Password updated successfully");
};



/* ================= REQUEST EMAIL CHANGE ================= */

export const requestChangeEmailOtp = async (req: Request, res: Response) => {
    let { newemail } = req.body || {};

    if (!newemail) {
        return sendError(res, 400, "This field is required.");
    }

    if (!isValidEmail(newemail)) {
        return sendError(res, 400, "Enter a valid email address.");
    }

    newemail = newemail.trim().toLowerCase();

    const emailExists = await User.findOne({ email: newemail });
    if (emailExists) {
        return sendError(res, 409, "Email already in use.");
    }

    const user = await User.findById((req as any).user.id);
    if (!user) {
        return sendError(res, 404, "User not found");
    }

    // Generate OTP
    const otpData = await createOtp(newemail, OtpPurpose.CHANGE_EMAIL);

    // Store pending email
    user.pendingEmail = newemail;
    await user.save();

    await sendChangeEmailOtpMail(newemail, otpData.otp);

    return sendSuccess(res, null, 200, "OTP sent to new email address");
};



/* ================= VERIFY OTP ===================== */
export const verifyChangeEmailOtp = async (req: Request, res: Response) => {
    let { newemail, otp } = req.body || {};

    if (!newemail) {
        return sendError(res, 400, "Email field is required.");
    }
    if (!otp) {
        return sendError(res, 400, "OTP field is required.");
    }

    newemail = newemail.trim().toLowerCase();
    otp = otp.toString().trim();

    const user = await User.findById((req as any).user.id);
    if (!user) {
        return sendError(res, 404, "User not found");
    }

    // OTP validation
    const valid = await verifyOtp(newemail, otp, OtpPurpose.CHANGE_EMAIL);
    if (!valid) {
        return sendError(res, 400, "Invalid or expired OTP");
    }

    // CRITICAL CHECK
    if (user.pendingEmail !== newemail) {
        return sendError(res, 400, "Email mismatch");
    }

    // UPDATE EMAIL
    user.email = newemail;
    user.pendingEmail = undefined;
    user.isEmailVerified = true;

    await user.save();

    return sendSuccess(res, null, 200, "Email updated successfully");
};

