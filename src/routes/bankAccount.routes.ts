import { Router } from "express";
import {
    createBankAccount,
    getBankAccounts,
    getBankAccountById,
    updateBankAccount,
    deleteBankAccount,
} from "../controllers/bankAccount.controller";
import { Permission } from "../constants/permissions";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";

const router = Router();

router.post("/", protect,requirePermission(Permission.BANK_ACCOUNT), createBankAccount);
router.get("/", protect,requirePermission(Permission.BANK_ACCOUNT), getBankAccounts);
router.get("/:id", protect,requirePermission(Permission.BANK_ACCOUNT), getBankAccountById);
router.put("/:id", protect, requirePermission(Permission.BANK_ACCOUNT),updateBankAccount);
router.delete("/:id", protect, requirePermission(Permission.BANK_ACCOUNT),deleteBankAccount);

export default router;
