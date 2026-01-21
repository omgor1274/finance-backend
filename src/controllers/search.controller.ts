import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import Party, { IParty } from "../models/Party.model";
import Transaction, { ITransaction } from "../models/Transaction.model";
import { UserRole } from "../models/User.model";
import { createParty } from "./party.controller";

/**
 * Global search for parties and transactions
 */
export const globalSearch = async (req: Request, res: Response) => {
    const user = req.user!;
    const q = (req.query.q as string)?.trim();

    // If no query, return empty arrays immediately
    if (!q) {
        return sendSuccess(
            res,
            { parties: [], transactions: [] },
            200,
            "No search query"
        );
    }

    const regex = new RegExp(q, "i");

    /* ===== PARTIES ===== 
       Filters by name. Supervisors only see their assigned parties.
    */
    const parties = await Party.find({
        name: regex,
        ...(user.role === UserRole.SUPERVISOR
            ? { supervisor: user._id }
            : {}),
    }).select("name balance type") as IParty[];

    /* ===== TRANSACTIONS ===== 
       Filters by partyName. Supervisors only see their assigned transactions.
    */
    const transactions = await Transaction.find({
        partyName: regex,
        ...(user.role === UserRole.SUPERVISOR
            ? { supervisor: user._id }
            : {}),
    }).select("partyName amount status createdAt") as ITransaction[];

    // Map the results to populate the 'data' object
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