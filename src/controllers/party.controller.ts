import Party from "../models/Party.model";
import { Request, Response } from "express";
import { UserRole } from "../models/User.model";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { generatePartyCode } from "../utils/generatePartyCode";

/* ================= CREATE PARTY ================= */

export const createParty = async (req: Request, res: Response) => {
  try {
    const { name, type, balance } = req.body;
    const authUser = (req as any).user;

    /* 🔐 ROLE CHECK */
    if (![UserRole.ADMIN, UserRole.SUPERVISOR].includes(authUser.role)) {
      return sendError(res, 403, "You are not allowed to create a party");
    }

    /* 🧪 VALIDATION */
    if (!name || !type) {
      return sendError(res, 400, "Name and type are required");
    }

    /* 🔢 CODE GENERATION */
    const { partyCode, partyCodeNumber } = await generatePartyCode();

    const party = await Party.create({
      name,
      type,
      balance: balance || 0,
      partyCode,
      partyCodeNumber,
      supervisor: authUser._id,
    });

    return sendSuccess(res, party, 201, "Party created successfully");
  } catch (error) {
    console.error("Create Party Error:", error);
    return sendError(res, 500, "Failed to create party");
  }
};
