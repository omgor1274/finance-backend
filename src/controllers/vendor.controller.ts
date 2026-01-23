import { Request, Response } from "express";
import Vendor from "../models/Vendor.model";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { UserRole } from "../models/User.model";

/* ================= CREATE VENDOR ================= */
export const createVendor = async (req: Request, res: Response) => {
  const user = (req as any).user;

  // Only ADMIN & SUPERVISOR
  if (![UserRole.ADMIN, UserRole.SUPERVISOR].includes(user.role)) {
    return sendError(res, 403, "Not allowed");
  }

  const {
    vendorName,
    contactName,
    category,
    phoneNumber,
    gstin,
    pan,
    address,
    city,
    state,
    pincode,
    site,
  } = req.body || {};

  if (!vendorName || !category || !phoneNumber) {
    return sendError(res, 400, "Required fields missing");
  }

  const exists = await Vendor.findOne({ phoneNumber });
  if (exists) {
    return sendError(res, 409, "Vendor already exists");
  }

  const vendor = await Vendor.create({
    vendorName,
    contactName,
    category,
    phoneNumber,
    gstin,
    pan,
    address,
    city,
    state,
    pincode,
    site,
    createdBy: user._id,
  });

  return sendSuccess(res, vendor, 201, "Vendor created");
};

/* ================= LIST VENDORS ================= */
export const getVendors = async (req: Request, res: Response) => {
  const q = (req.query.q as string)?.trim();

  const query: any = {};
  if (q) {
    query.vendorName = new RegExp(q, "i");
  }

  const vendors = await Vendor.find(query)
    .sort({ createdAt: -1 })
    .limit(50);

  return sendSuccess(res, vendors, 200, "Vendors list");
};

/* ================= GET VENDOR ================= */
export const getVendorById = async (req: Request, res: Response) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return sendError(res, 404, "Vendor not found");
  }

  return sendSuccess(res, vendor, 200, "Vendor details");
};

/* ================= UPDATE VENDOR ================= */
export const updateVendor = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (![UserRole.ADMIN, UserRole.SUPERVISOR].includes(user.role)) {
    return sendError(res, 403, "Not allowed");
  }

  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!vendor) {
    return sendError(res, 404, "Vendor not found");
  }

  return sendSuccess(res, vendor, 200, "Vendor updated");
};
