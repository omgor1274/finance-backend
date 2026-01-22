import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import Party from "../models/Party.model";
import Transaction from "../models/Transaction.model";
import User, { UserRole } from "../models/User.model";

export const globalSearch = async (req: Request, res: Response) => {
    const authUser = (req as any).user;
    const q = (req.query.q as string)?.trim().toLowerCase();

    if (!q) {
        return sendSuccess(
            res,
            { users: [], parties: [], transactions: [] },
            200,
            "No search query"
        );
    }

    const regex = new RegExp(q, "i");
    const isNumber = !isNaN(Number(q));

    /* ================= USERS ================= */
    const userQuery: any = {
        $or: [
            { email: regex },
            { userCode: regex },
        ],
    };

    if (isNumber) {
        userQuery.$or.push({ phonenumber: Number(q) });
    }

    const users = await User.find(userQuery)
        .select("email phonenumber role userCode")
        .limit(5);

    /* ================= PARTIES ================= */
    const partyQuery: any = {
        $or: [
            { name: regex },
            { partyCode: regex },
        ],
    };

    if (authUser.role === UserRole.SUPERVISOR) {
        partyQuery.supervisor = authUser._id;
    }

    const parties = await Party.find(partyQuery)
        .select("name partyCode balance type")
        .limit(5);

    /* ================= TRANSACTIONS ================= */
    const transactionQuery: any = {
        $or: [
            { partyName: regex },
            { referenceNumber: regex },
            { status: regex },
        ],
    };

    if (isNumber) {
        transactionQuery.$or.push({ amount: Number(q) });
    }

    if (authUser.role === UserRole.SUPERVISOR) {
        transactionQuery.supervisor = authUser._id;
    }

    const transactions = await Transaction.find(transactionQuery)
        .select("partyName amount status createdAt")
        .limit(5)
        .sort({ createdAt: -1 });

    return sendSuccess(
        res,
        { users, parties, transactions },
        200,
        "Search results"
    );
};
