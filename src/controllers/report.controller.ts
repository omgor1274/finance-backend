import { Request, Response } from "express";
import Invoice from "../models/Invoice.model";
import { sendError } from "../utils/apiResponse";
import { generateReportPDF } from "../utils/reportPdf.util";

/**
 * 📥 Download Invoice Report
 */
export const downloadInvoiceReport = async (req: Request, res: Response) => {
  const {
    timePeriod,
    startDate,
    endDate,
    location,
    paymentStatus,
  } = req.query;

  /* ================= DATE FILTER ================= */
  const dateFilter: any = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (timePeriod === "TODAY") {
    dateFilter.$gte = today;
  }

  if (timePeriod === "LAST_7_DAYS") {
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);
    dateFilter.$gte = last7;
  }

  if (timePeriod === "THIS_MONTH") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    dateFilter.$gte = start;
  }

  if (timePeriod === "CUSTOM" && startDate && endDate) {
    dateFilter.$gte = new Date(startDate as string);
    dateFilter.$lte = new Date(endDate as string);
  }

  /* ================= MATCH STAGE ================= */
  const matchStage: any = {};

  if (Object.keys(dateFilter).length) {
    matchStage.issueDate = dateFilter;
  }

  if (paymentStatus && paymentStatus !== "ALL") {
    matchStage.status = paymentStatus;
  }

  if (location && location !== "ALL") {
    matchStage["items.location"] = location;
  }

  /* ================= AGGREGATION ================= */
  const reportData = await Invoice.aggregate([
    { $match: matchStage },

    {
      $project: {
        invoiceNumber: 1,
        issueDate: 1,
        billedTo: "$billedTo.name",
        status: 1,
        grandTotal: 1,
      },
    },

    { $sort: { issueDate: -1 } },

    {
      $group: {
        _id: null,
        invoices: { $push: "$$ROOT" },
        totalAmount: { $sum: "$grandTotal" },
        totalInvoices: { $sum: 1 },
      },
    },
  ]);

  if (!reportData.length) {
    return sendError(res, 404, "No data found for selected filters");
  }

  /* ================= PDF ================= */
  const pdfDoc = generateReportPDF(reportData[0]);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-report.pdf`
  );

  pdfDoc.pipe(res);
};
