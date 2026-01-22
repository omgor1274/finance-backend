import { Request, Response } from "express";
import Party from "../models/Party.model";
import { sendSuccess, sendError } from "../utils/apiResponse";
import Counter from "../models/Counter.model";
import { generatePartyCode } from "../utils/generatePartyCode";

/* ================= CREATE PARTY ================= */



export const createParty = async (req: Request, res: Response) => {
  const { name, type, balance } = req.body;

  const { partyCode, partyCodeNumber } = await generatePartyCode();

  const party = await Party.create({
    name,
    type,
    balance,
    partyCode,
    partyCodeNumber,
    supervisor: (req as any).user.id,
  });

  res.json(party);
};



