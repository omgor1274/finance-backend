import jwt from "jsonwebtoken";
import { sendError } from "../utils/apiResponse";
import User, { IUser } from "../models/User.model";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    userId: string;
    role: string;
}

/* Extend Express Request */
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendError(res, 401, "Authorization token missing");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return sendError(res, 401, "User not found");
        }

        req.user = user;
        next();
    } catch {
        return sendError(res, 401, "Invalid or expired token");
    }
};
