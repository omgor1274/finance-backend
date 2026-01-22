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
    address,
    bloodGroup,
    dateOfBirth,
  } = req.body;
  console.log(req.body);

  /* ================= BASIC VALIDATION ================= */
  if (!firstName || !lastName || !email || !phonenumber || !address || !salary || !role || !password) {
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
    address,
    bloodGroup,
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

//--------------GET USER----------------//

export const getUser = async (req: Request, res: Response) => {
  const { userCode, email, phonenumber } = req.query;

  if (!userCode && !email && !phonenumber) {
    return sendError(
      res,
      400,
      "Provide userCode or email or phonenumber"
    );
  }

  const query: any = {};

  if (userCode) query.userCode = userCode;
  if (email) query.email = String(email).toLowerCase();
  if (phonenumber) query.phonenumber = phonenumber;

  const user = await User.findOne(query).select("-password");

  if (!user) {
    return sendError(res, 404, "User not found");
  }

  const formatIndianDate = (date?: Date) =>
    date
      ? date.toLocaleDateString("en-IN").replace(/\//g, "-")
      : null;

  const getFullImageUrl = (req: Request, path?: string) => {
    if (!path) return null;
    return `${req.protocol}://${req.get("host")}${path}`;
  };

  return sendSuccess(
    res,
    ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phonenumber: user.phonenumber,
      address: user.address,
      bloodGroup: user.bloodGroup,
      dateOfBirth: formatIndianDate(user.dateOfBirth),
      salary: user.salary,
      salaryType: user.salaryType,
      role: user.role,
      userCode: user.userCode,        // read-only
      assignedLocations: user.assignedLocations,
      profileImage: getFullImageUrl(req, user.profileImage),
    }),
    200,
    "User detail"
  );
};


//--------------Update User-------------//

export const updateUserByKey = async (req: Request, res: Response) => {
  const { userCode, email, phonenumber } = req.query;

  if (!userCode && !email && !phonenumber) {
    return sendError(
      res,
      400,
      "Provide userCode or email or phonenumber"
    );
  }

  if (req.body.email || req.body.userCode || req.body.role) {
    return sendError(
      res,
      400,
      "Email, User ID and Role cannot be edited"
    );
  }

  const updateData: any = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phonenumber: req.body.phonenumber,
    address: req.body.address,
    bloodGroup: req.body.bloodGroup,
    salary: req.body.salary,
    profileImage: req.body.profileImage,
    salaryType: req.body.salaryType,

    assignedLocations: req.body.assignedLocations,
  };

  if (req.body.dateOfBirth) {
    updateData.dateOfBirth = new Date(req.body.dateOfBirth);
  }

  if (req.file) {
    updateData.profileImage = `/uploads/users/${req.file.filename}`;
  }

  const filter: any = {};
  if (userCode) filter.userCode = userCode;
  if (email) filter.email = String(email).toLowerCase();
  if (phonenumber) filter.phonenumber = phonenumber;

  const user = await User.findOneAndUpdate(filter, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return sendError(res, 404, "User not found");
  }

  const formatIndianDate = (date?: Date) =>
    date
      ? date.toLocaleDateString("en-IN").replace(/\//g, "-")
      : null;

  const getFullImageUrl = (req: Request, path?: string) => {
    if (!path) return null;
    return `${req.protocol}://${req.get("host")}${path}`;
  };
  return sendSuccess(
    res,
    ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phonenumber: user.phonenumber,
      address: user.address,
      bloodGroup: user.bloodGroup,
      dateOfBirth: formatIndianDate(user.dateOfBirth),
      salary: user.salary,
      salaryType: user.salaryType,
      role: user.role,
      userCode: user.userCode,        // read-only
      assignedLocations: user.assignedLocations,
      profileImage: getFullImageUrl(req, user.profileImage),
    }),
    200,
    "User updated successfully"
  );
};

