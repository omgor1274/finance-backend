import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBankAccount extends Document {
  accountHolderName: string;   // Green Arch
  bankName: string;            // Bank of Baroda
  accountNumber: string;
  ifscCode: string;
  accountType: string;         // Savings / Current

  createdBy: Types.ObjectId;   // User (Admin / Supervisor)

  createdAt: Date;
  updatedAt: Date;
}

const bankAccountSchema = new Schema<IBankAccount>(
  {
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    bankName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    ifscCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    accountType: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBankAccount>(
  "BankAccount",
  bankAccountSchema
);