import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISearchHistory extends Document {
  user: Types.ObjectId;
  query: string;
  createdAt: Date;
}

const searchHistorySchema = new Schema<ISearchHistory>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    query: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISearchHistory>(
  "SearchHistory",
  searchHistorySchema
);