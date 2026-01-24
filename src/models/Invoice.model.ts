import mongoose, { Schema, Document, Types } from "mongoose";

export enum InvoiceStatus {
    DRAFT = "DRAFT",
    GENERATED = "GENERATED",
    PAID = "PAID",
}

export interface IInvoiceItem {
    description: string;
    location?: string;
    quantity: number;
    rate: number;
    gstPercent?: number;
    total: number;
}

export interface IInvoice extends Document {
    invoiceNumber: string;

    // Dates
    issueDate: Date;
    dueDate: Date;

    // Parties
    billedBy: {
        name: string;
        businessName?: string;
        gst?: string;
        address: string;
        phone?: string;
        pan?: string;
    };

    billedTo: {
        name: string;
        businessName?: string;
        gst?: string;
        address: string;
        phone?: string;
        pan?: string;
    };

    // Items
    items: IInvoiceItem[];

    // Totals
    subTotal: number;
    gstTotal: number;
    grandTotal: number;

    // Bank
    bankAccount: Types.ObjectId;

    // Meta
    status: InvoiceStatus;
    createdBy: Types.ObjectId;
}

const invoiceItemSchema = new Schema<IInvoiceItem>(
    {
        description: { type: String, required: true },
        location: { type: String },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        gstPercent: { type: Number },
        total: { type: Number, required: true },
    },
    { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        issueDate: { type: Date, required: true },
        dueDate: { type: Date, required: true },

        billedBy: {
            name: String,
            businessName: String,
            gst: String,
            address: String,
            phone: String,
            pan: String,
        },

        billedTo: {
            name: String,
            businessName: String,
            gst: String,
            address: String,
            phone: String,
            pan: String,
        },

        items: [invoiceItemSchema],

        subTotal: Number,
        gstTotal: Number,
        grandTotal: Number,

        bankAccount: {
            type: Schema.Types.ObjectId,
            ref: "BankAccount",
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(InvoiceStatus),
            default: InvoiceStatus.DRAFT,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IInvoice>("Invoice", invoiceSchema);
