import Counter from "../models/Counter.model";

export const generatePartyCode = async () => {
    const counter = await Counter.findOneAndUpdate(
        { key: "PARTY" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const number = counter.seq;

    return {
        partyCode: `P${number.toString().padStart(3, "0")}`,
        partyCodeNumber: number,
    };
};
