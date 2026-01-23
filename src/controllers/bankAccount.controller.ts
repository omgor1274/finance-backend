import { Request, Response } from "express";
import BankAccount from "../models/BankAccount.model";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { UserRole } from "../models/User.model";

/* ================= CREATE BANK ACCOUNT ================= */
export const createBankAccount = async (req: Request, res: Response) => {


    const {
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
    } = req.body || {};

    if (
        !accountHolderName ||
        !bankName ||
        !accountNumber ||
        !ifscCode ||
        !accountType
    ) {
        return sendError(res, 400, "Required fields missing");
    }

    const exists = await BankAccount.findOne({ accountNumber });
    if (exists) {
        return sendError(res, 409, "Bank account already exists");
    }

    const account = await BankAccount.create({
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
        createdBy: (req as any).user._id,
    });

    return sendSuccess(res, account, 201, "Bank account added");
};

/* ================= LIST BANK ACCOUNTS ================= */
export const getBankAccounts = async (req: Request, res: Response) => {
    const q = (req.query.q as string)?.trim();

    const query: any = {};
    if (q) {
        query.$or = [
            { accountHolderName: new RegExp(q, "i") },
            { bankName: new RegExp(q, "i") },
            { accountNumber: new RegExp(q, "i") },
        ];
    }

    const accounts = await BankAccount.find(query)
        .sort({ createdAt: -1 });

    return sendSuccess(res, accounts, 200, "Bank accounts list");
};

/* ================= GET BANK ACCOUNT ================= */
export const getBankAccountById = async (req: Request, res: Response) => {
    const account = await BankAccount.findById(req.params.id);

    if (!account) {
        return sendError(res, 404, "Bank account not found");
    }

    return sendSuccess(res, account, 200, "Bank account details");
};

/* ================= UPDATE BANK ACCOUNT ================= */
export const updateBankAccount = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (user.role !== UserRole.ADMIN) {
        return sendError(res, 403, "Only admin can update bank account");
    }

    const account = await BankAccount.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!account) {
        return sendError(res, 404, "Bank account not found");
    }

    return sendSuccess(res, account, 200, "Bank account updated");
};

/* ================= DELETE BANK ACCOUNT ================= */
export const deleteBankAccount = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (user.role !== UserRole.ADMIN) {
        return sendError(res, 403, "Only admin can delete bank account");
    }

    const account = await BankAccount.findByIdAndDelete(req.params.id);

    if (!account) {
        return sendError(res, 404, "Bank account not found");
    }

    return sendSuccess(res, null, 200, "Bank account deleted");
};