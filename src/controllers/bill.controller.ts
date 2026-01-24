import { Request, Response } from "express";
import { UserRole } from "../models/User.model";
import Bill, { BillStatus } from "../models/Bill.model";
import { sendError, sendSuccess } from "../utils/apiResponse";

/* ================= CREATE BILL ================= */
export const createBill = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const {
        party,
        partyName,
        billNumber,
        billDate,
        amount,
        paidAmount = 0,
        type,
        paymentMethod,
        notes,
        location,
        referenceNumber,
    } = req.body || {};

    if (!partyName || !billDate || !amount || !type) {
        return sendError(res, 400, "Required fields missing");
    }

    const paid = Number(paidAmount);
    const totalAmount = Number(amount);

    if (paid > totalAmount) {
        return sendError(res, 400, "Paid amount cannot exceed total amount");
    }

    const balance = totalAmount - paid;

    const bill = await Bill.create({
        party,
        partyName,
        billNumber,
        billDate: new Date(billDate),
        amount: totalAmount,
        paidAmount: paid,
        balanceAmount: balance,
        status: balance === 0 ? "PAID" : paid > 0 ? "PARTIAL" : "UNPAID",
        type,
        paymentMethod,
        notes,
        location,
        referenceNumber,
        attachment: req.file
            ? `/uploads/attachments/${req.file.filename}`
            : undefined,

        createdBy: user._id,
        supervisor: user.role === UserRole.SUPERVISOR ? user._id : undefined,
    });

    return sendSuccess(res, bill, 201, "Bill added successfully");
};

/* ================= LIST BILLS ================= */
export const getBills = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { q, status, type } = req.query;

    const query: any = {};

    if (q) query.partyName = new RegExp(String(q), "i");
    if (status) query.status = status;
    if (type) query.type = type;

    // Supervisor sees only own bills
    if (user.role === UserRole.SUPERVISOR) {
        query.supervisor = user._id;
    }

    const bills = await Bill.find(query)
        .sort({ billDate: -1 })
        .limit(50);

    return sendSuccess(res, bills, 200, "Bills list");
};

/* ================= BILL DETAILS ================= */
export const getBillById = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const bill = await Bill.findById(req.params.id);

    if (!bill) {
        return sendError(res, 404, "Bill not found");
    }

    // Supervisor access protection
    if (
        user.role === UserRole.SUPERVISOR &&
        bill.supervisor?.toString() !== user._id.toString()
    ) {
        return sendError(res, 403, "Access denied");
    }

    return sendSuccess(res, bill, 200, "Bill details");
};

/* ================= UPDATE BILL ================= */
export const updateBill = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const {
        billDate,
        amount,
        paidAmount,
        paymentMethod,
        notes,
    } = req.body || {};

    const bill = await Bill.findById(req.params.id);

    if (!bill) {
        return sendError(res, 404, "Bill not found");
    }

    // Supervisor can update only own bills
    if (
        user.role === UserRole.SUPERVISOR &&
        bill.supervisor?.toString() !== user._id.toString()
    ) {
        return sendError(res, 403, "Access denied");
    }

    if (amount !== undefined && paidAmount !== undefined) {
        const balance = amount - paidAmount;
        bill.amount = amount;
        bill.paidAmount = paidAmount;
        bill.balanceAmount = balance;
        bill.status =
            balance === 0 ? BillStatus.PAID : balance > 0 ? BillStatus.PARTIAL : BillStatus.UNPAID;
    }

    if (billDate) bill.billDate = new Date(billDate);
    if (paymentMethod) bill.paymentMethod = paymentMethod;
    if (notes) bill.notes = notes;

    if (req.file) {
        bill.attachment = `/uploads/attachments/${req.file.filename}`;
    }

    await bill.save();

    return sendSuccess(res, bill, 200, "Bill updated successfully");
};

/* ================= DELETE BILL ================= */
export const deleteBill = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const bill = await Bill.findById(req.params.id);

    if (!bill) {
        return sendError(res, 404, "Bill not found");
    }

    // Supervisor can delete only own bills
    if (
        user.role === UserRole.SUPERVISOR &&
        bill.supervisor?.toString() !== user._id.toString()
    ) {
        return sendError(res, 403, "Access denied");
    }

    await bill.deleteOne();

    return sendSuccess(res, null, 200, "Bill deleted successfully");
};
