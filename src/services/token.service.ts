import jwt from "jsonwebtoken";
import { UserRole } from "../models/User.model";

interface TokenPayload {
  userId: string;
  role: UserRole;
}

export const generateToken = (
  userId: string,
  role: UserRole
): string => {
  const payload: TokenPayload = {
    userId,
    role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};
