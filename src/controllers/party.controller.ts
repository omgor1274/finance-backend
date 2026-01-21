import { Request, Response } from "express";
import Party from "../models/Party.model";
import { sendSuccess, sendError } from "../utils/apiResponse";

export const createParty = async (req: Request, res: Response) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return sendError(res, 400, "Name and type are required");
  }

  const party = await Party.create({
    name,
    type,
    supervisor: req.user?.role === "SUPERVISOR" ? req.user._id : undefined,
  });

  return sendSuccess(res, party, 201, "Party created successfully");
};