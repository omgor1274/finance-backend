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
}

const partySchema = new Schema<IParty>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
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
