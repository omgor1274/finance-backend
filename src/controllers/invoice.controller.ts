import { Request, Response } from "express";
import Invoice from "../models/Invoice.model";
import { generateInvoicePDF } from "../utils/invoicePdf.util";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { generateInvoiceNumber } from "../services/invoiceNumber.service";

export const createInvoice = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const payload = req.body;

    if (!payload.items?.length || !payload.bankAccount) {
        return sendError(res, 400, "Invalid invoice data");
    }

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await Invoice.create({
        ...payload,
        invoiceNumber,
        createdBy: user._id,
    });

    return sendSuccess(res, invoice, 201, "Invoice created");
};

/**
 * 📄 Invoice list (UI list screen)
 * Uses aggregation for summary
 */
export const listInvoices = async (req: Request, res: Response) => {
    const invoices = await Invoice.aggregate([
        {
            $project: {
                invoiceNumber: 1,
                issueDate: 1,
                grandTotal: 1,
                status: 1,
                billedTo: "$billedTo.name",
            },
        },
        { $sort: { issueDate: -1 } },
    ]);

    return sendSuccess(res, invoices, 200, "Invoices fetched");
};

/**
 * 🧾 Invoice detail
 */
export const getInvoiceById = async (req: Request, res: Response) => {
    const invoice = await Invoice.findById(req.params.id).populate("bankAccount");

    if (!invoice) {
        return sendError(res, 404, "Invoice not found");
    }

    return sendSuccess(res, invoice, 200, "Invoice fetched");
};

/** 📥 Download invoice as PDF
 */

export const downloadInvoicePDF = async (req: Request, res: Response) => {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
        return sendError(res, 404, "Invoice not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${invoice.invoiceNumber}.pdf`
    );

    const pdfDoc = generateInvoicePDF(invoice);
    pdfDoc.pipe(res);
};

/**
 * 🗑 Delete invoice
 */
export const deleteInvoice = async (req: Request, res: Response) => {
    await Invoice.findByIdAndDelete(req.params.id);
    return sendSuccess(res, null, 200, "Invoice deleted");
};
