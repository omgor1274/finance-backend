import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
    key: { type: String, unique: true },
    seq: { type: Number, default: 0 },
});

export default mongoose.model("Counter", counterSchema);
