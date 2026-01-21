import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import Party from "../models/Party.model";
import Transaction from "../models/Transaction.model";
import { UserRole } from "../models/User.model";

export const globalSearch = async (req: Request, res: Response) => {
    const user = req.user!;
    const q = (req.query.q as string)?.trim();

    if (!q) {
        return sendSuccess(
            res,
            { parties: [], transactions: [] },
            200,
            "No search query"
        );
    }

    const regex = new RegExp(q, "i");

    /* ===== PARTIES (ONLY Party model) ===== */
    const parties = await Party.find({
        name: regex,
        ...(user.role === UserRole.SUPERVISOR
            ? { supervisor: user._id }
            : {}),
    }).select("name balance type");

    /* ===== TRANSACTIONS (ONLY Transaction model) ===== */
    const transactions = await Transaction.find({
        partyName: regex,
        ...(user.role === UserRole.SUPERVISOR
            ? { supervisor: user._id }
            : {}),
    }).select("partyName amount status createdAt");

    return sendSuccess(
        res,
        {
            parties: parties.map(p => ({
                id: p._id,
                name: p.name,
                balance: p.balance,
                type: p.type,
            })),

            transactions: transactions.map(t => ({
                id: t._id,
                partyName: t.partyName,
                amount: t.amount,
                status: t.status,
                createdAt: t.createdAt,
            })),
        },
        200,
        "Search results"
    );
};
