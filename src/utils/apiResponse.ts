import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  status: number = 200,
  message: string = "Operation completed successfully"
) => {
  return res.status(status).send({
    data,
    status,
    success: true,
    error: false,
    message
  });
};

export const sendError = (
  res: Response,
  status: number = 400,
  message: string = "Something went wrong"
) => {
  return res.status(status).send({
    data: null,
    status,
    success: false,
    error: true,
    message
  });
};
