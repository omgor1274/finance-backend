import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("SERVER ERROR:", err);

  return sendError(
    res,
    500,
    "Something went wrong. Please try again later."
  );
};
