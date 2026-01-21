import mongoose, { Schema, Document, Types } from "mongoose";

/* ================= ENUMS ================= */

export enum TransactionType {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT",
    INTERNAL_TRANSFER = "INTERNAL_TRANSFER",
}

export enum TransactionStatus {
    PAID = "Paid",
    PARTIAL = "Partially Paid",
    ADVANCE = "Advance Paid",
    PENDING = "Pending",
}

export enum PaymentMethod {
    CASH = "Cash",
    UPI = "UPI",
    BANK_TRANSFER = "Bank Transfer",
}

/* ================= INTERFACE ================= */

export interface ITransaction extends Document {
    type: TransactionType;

    party: Types.ObjectId;
    partyName: string;

    amount: number;
    status: TransactionStatus;
    paymentMethod: PaymentMethod;

    referenceNumber?: string;
    location?: string;
    date?: string;
    time?: string;
    attachment?: string;
    notes?: string;

    createdBy: Types.ObjectId;
    supervisor?: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

/* ================= SCHEMA ================= */

const transactionSchema = new Schema<ITransaction>(
    {
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true,
        },

        party: {
            type: Schema.Types.ObjectId,
            ref: "Party",
            required: true,
        },

        partyName: {
            type: String,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            default: TransactionStatus.PENDING,
        },

        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },

        referenceNumber: {
            type: String,
            trim: true,
        },

        location: {
            type: String,
            trim: true,
        },

        date: {
            type: String,
        },

        time: {
            type: String,
        },

        attachment: {
            type: String, 
        },

        notes: {
            type: String,
            trim: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        supervisor: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

/* ================= INDEXES ================= */
transactionSchema.index({ partyName: 1 });
transactionSchema.index({ createdBy: 1 });
transactionSchema.index({ supervisor: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
