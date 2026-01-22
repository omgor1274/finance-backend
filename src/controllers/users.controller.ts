import { Request, Response } from "express";
import User, { UserRole } from "../models/User.model";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { CAN_CREATE } from "../utils/rolePermissions";
import { generateUserCode } from "../utils/generateUserCode";

export const createUser = async (req: Request, res: Response) => {
  const authUser = (req as any).user;

  const {
    firstName,
    lastName,
    email,
    phonenumber,
    salary,
    salaryType,
    role,
    password,
    dateOfBirth,
  } = req.body;

  /* ================= BASIC VALIDATION ================= */
  if (!firstName || !email || !phonenumber || !salary || !role || !password) {
    return sendError(res, 400, "Required fields missing");
  }

  /* ================= ROLE PERMISSION CHECK ================= */
  const allowedRoles = CAN_CREATE[authUser.role as UserRole] || [];

  if (!allowedRoles.includes(role)) {
    return sendError(
      res,
      403,
      "You are not allowed to create this user role"
    );
  }

  /* ================= DUPLICATE CHECK ================= */
  const exists = await User.findOne({
    $or: [{ email }, { phonenumber }],
  });

  if (exists) {
    return sendError(res, 409, "User with email or phone already exists");
  }

  /* ================= GENERATE USER CODE ================= */
  const codeData = await generateUserCode(role);

  /* ================= CREATE USER ================= */
  const formatIndianDate = (date?: Date) =>
    date
      ? date.toLocaleDateString("en-IN").replace(/\//g, "-")
      : null;

  const user = await User.create({
    firstName,
    lastName,
    email,
    phonenumber,
    salary,
    salaryType: salaryType || "MONTHLY",
    role,
    password,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    profileImage: req.file
      ? `/uploads/users/${req.file.filename}`
      : undefined,
    ...codeData,
  });

  /* ================= RESPONSE ================= */
  return sendSuccess(
    res,
    {
      id: user._id,
      email: user.email,
      dateOfBirth: formatIndianDate(user.dateOfBirth),
      role: user.role,
      userCode: user.userCode,
      profileImage: user.profileImage,
    },
    201,
    "User created successfully"
  );
};
