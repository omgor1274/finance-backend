import mongoose from "mongoose";
import { Request, Response } from "express";
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

/* ================= LIST FUNDS ================= */
export const getFunds = async (req: Request, res: Response) => {
    const {
        type,
        status,
        paymentMethod,
        partyId,
        location,
        startDate,
        endDate,
    } = req.query;

    const matchStage: any = {};

    /* ================= FILTERS ================= */

    if (type) {
        matchStage.type = type;
    }

    if (status) {
        matchStage.status = status;
    }

    if (paymentMethod) {
        matchStage.paymentMethod = paymentMethod;
    }

    if (partyId) {
        if (!mongoose.Types.ObjectId.isValid(partyId as string)) {
            return sendError(res, 400, "Invalid party ID");
        }
        matchStage.party = new mongoose.Types.ObjectId(partyId as string);
    }

    if (location) {
        matchStage.location = location;
    }

    // Date range filter
    if (startDate || endDate) {
        matchStage.date = {};
        if (startDate) {
            matchStage.date.$gte = new Date(startDate as string);
        }
        if (endDate) {
            matchStage.date.$lte = new Date(endDate as string);
        }
    }

    /* ================= AGGREGATION ================= */

    const funds = await Transaction.aggregate([
        { $match: matchStage },

        {
            $lookup: {
                from: "parties",
                localField: "party",
                foreignField: "_id",
                as: "partyDetails",
            },
        },
        { $unwind: "$partyDetails" },

        {
            $project: {
                type: 1,
                amount: 1,
                paymentMethod: 1,
                status: 1,
                referenceNumber: 1,
                location: 1,
                date: 1,
                time: 1,
                notes: 1,
                attachment: 1,
                createdAt: 1,

                party: {
                    _id: "$partyDetails._id",
                    name: "$partyDetails.name",
                },
            },
        },

        { $sort: { date: -1, createdAt: -1 } },
    ]);

    return sendSuccess(res, funds, 200, "Funds fetched successfully");
};

/* ================= FUND BY ID ================= */
export const getFundById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendError(res, 400, "Invalid fund ID");
    }

    const fund = await Transaction.findById(id)
        .populate("party", "name")
        .populate("createdBy", "firstName lastName");

    if (!fund) {
        return sendError(res, 404, "Fund not found");
    }

    return sendSuccess(res, fund, 200, "Fund fetched successfully");
};



