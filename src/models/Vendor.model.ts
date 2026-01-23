import mongoose, { Schema, Document, Types } from "mongoose";

export interface IVendor extends Document {
    vendorName: string;          // FreshCo Paints
    contactName?: string;        // Het Patel
    category: string;            // Hardware & Tools Store

    phoneNumber: string;
    gstin?: string;
    pan?: string;

    address?: string;
    city?: string;
    state?: string;
    pincode?: string;

    site?: Types.ObjectId;       // Location / Site
    createdBy: Types.ObjectId;   // Admin / Supervisor

    createdAt: Date;
    updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
    {
        vendorName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        contactName: {
            type: String,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            index: true,
        },

        phoneNumber: {
            type: String,
            required: true,
            index: true,
        },

        gstin: {
            type: String,
            trim: true,
            index: true,
        },

        pan: {
            type: String,
            trim: true,
            index: true,
        },

        address: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            trim: true,
        },

        state: {
            type: String,
            trim: true,
        },

        pincode: {
            type: String,
            trim: true,
        },

        site: {
            type: Schema.Types.ObjectId,
            ref: "Location",
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IVendor>("Vendor", vendorSchema);
