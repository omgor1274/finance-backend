import mongoose, { Schema, Document, Types } from "mongoose";

export enum PartyType {
    CUSTOMER = "CUSTOMER",
    SUPPLIER = "SUPPLIER",
}

export interface IParty extends Document {
    name: string;
    type: PartyType;
    balance: number;
    supervisor?: Types.ObjectId;
    partyCode: string;        // W001
    partyCodeNumber: number;  // 1
}

const partySchema = new Schema<IParty>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        partyCode: {
            type: String,
            unique: true,
            index: true, // 🔥 for search
        },

        partyCodeNumber: {
            type: Number,
            unique: true,
            index: true, // 🔥 for sorting
        },

        type: {
            type: String,
            enum: Object.values(PartyType),
            required: true,
        },

        balance: {
            type: Number,
            default: 0,
        },

        supervisor: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IParty>("Party", partySchema);
