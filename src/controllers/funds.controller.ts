// src/controllers/fund.controller.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import Party from "../models/Party.model";
import Transaction from "../models/Transaction.model";
import { sendSuccess, sendError } from "../utils/apiResponse";

export const createFund = async (req: Request, res: Response) => {
    const {
        type,
        partyId,
        amount,
        paymentMethod,
        status,
        referenceNumber,
        location,
        date,
        time,
        attachment,
        notes,
    } = req.body || {};

    const attachmentPath = req.file ? req.file.path : undefined;

    if (!partyId) {
        return sendError(res, 400, "Party is required");
    }

    if (!type || !amount || !paymentMethod || !status) {
        return sendError(res, 400, "Required fields missing");
    }

    if (!mongoose.Types.ObjectId.isValid(partyId)) {
        return sendError(res, 400, "Invalid party ID");
    }

    const party = await Party.findById(partyId);
    if (!party) {
        return sendError(res, 404, "Party not found");
    }

    const transaction = await Transaction.create({
        type,
        party: party._id,
        partyName: party.name,
        amount,
        paymentMethod,
        status,
        referenceNumber,
        location,
        date,
        time,
        notes,
        attachment: attachmentPath,
        createdBy: (req as any).user!._id,
    });

    return sendSuccess(res, transaction, 201, "Fund created successfully");
};
