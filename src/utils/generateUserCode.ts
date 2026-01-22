import Counter from "../models/Counter.model";
import { UserRole } from "../models/User.model";

const rolePrefixMap: Record<UserRole, string | null> = {
    WORKER: "W",
    SUPERVISOR: "S",
    SUB_ADMIN: "A",
    ADMIN: null, // no code for admin
};

export const generateUserCode = async (role: UserRole) => {
    const prefix = rolePrefixMap[role];

    // Admin does not need a code
    if (!prefix) {
        return {};
    }

    const counterKey = `USER_${role}`;

    const counter = await Counter.findOneAndUpdate(
        { key: counterKey },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const number = counter.seq;

    return {
        userCode: `${prefix}${number.toString().padStart(3, "0")}`,
        userCodeNumber: number,
    };
};
