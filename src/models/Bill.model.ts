import mongoose, { Schema, Document, Types } from "mongoose";

export enum BillType {
    PURCHASE = "PURCHASE",
    EXPENSE = "EXPENSE",
}

export enum BillStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    PARTIAL = "PARTIAL",
}

export interface IBill extends Document {
    party: Types.ObjectId;
    partyName: string;

    billNumber: string;
    billDate: Date;

    amount: number;
    paidAmount: number;
    balanceAmount: number;

    type: BillType;
    status: BillStatus;

    paymentMethod?: string;
    notes?: string;

    attachment?: string;

    createdBy: Types.ObjectId;
    supervisor?: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const billSchema = new Schema<IBill>(
    {
        party: {
            type: Schema.Types.ObjectId,
            ref: "Party",
            required: true,
        },

        partyName: {
            type: String,
            required: true,
            index: true,
        },

        billNumber: {
            type: String,
            required: true,
            index: true,
        },

        billDate: {
            type: Date,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        paidAmount: {
            type: Number,
            default: 0,
        },

        balanceAmount: {
            type: Number,
            required: true,
        },

        type: {
            type: String,
            enum: Object.values(BillType),
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: Object.values(BillStatus),
            default: BillStatus.UNPAID,
            index: true,
        },

        paymentMethod: {
            type: String,
        },

        notes: {
            type: String,
        },

        attachment: {
            type: String, // /uploads/attachments/xxx.pdf
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        supervisor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IBill>("Bill", billSchema);
