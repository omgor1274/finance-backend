import { Router } from "express";
import {
    createInvoice,
    listInvoices,
    getInvoiceById,
    deleteInvoice,
    downloadInvoicePDF
} from "../controllers/invoice.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { Permission } from "../constants/permissions";

const router = Router();

// 📄 List invoices
router.get(
    "/",
    protect,
    requirePermission(Permission.INVOICE),
    listInvoices
);

// ➕ Create invoice
router.post(
    "/",
    protect,
    requirePermission(Permission.INVOICE),
    createInvoice
);

// 🧾 Invoice detail
router.get(
    "/:id",
    protect,
    requirePermission(Permission.INVOICE),
    getInvoiceById
);

// 📥 Download invoice as PDF
router.get(
    "/:id/pdf",
    protect,
    requirePermission(Permission.INVOICE),
    downloadInvoicePDF
);

// 🗑 Delete invoice
router.delete(
    "/:id",
    protect,
    requirePermission(Permission.INVOICE),
    deleteInvoice
);

export default router;
