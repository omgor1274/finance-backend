import { Router } from "express";
import {
    createBankAccount,
    getBankAccounts,
    getBankAccountById,
    updateBankAccount,
    deleteBankAccount,
} from "../controllers/bankAccount.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { Permission } from "../constants/permissions";

const router = Router();

router.post("/bank-accounts", protect,requirePermission(Permission.BANK_ACCOUNT), createBankAccount);
router.get("/bank-accounts", protect,requirePermission(Permission.BANK_ACCOUNT), getBankAccounts);
router.get("/bank-accounts/:id", protect,requirePermission(Permission.BANK_ACCOUNT), getBankAccountById);
router.put("/bank-accounts/:id", protect, requirePermission(Permission.BANK_ACCOUNT),updateBankAccount);
router.delete("/bank-accounts/:id", protect, requirePermission(Permission.BANK_ACCOUNT),deleteBankAccount);

export default router;
