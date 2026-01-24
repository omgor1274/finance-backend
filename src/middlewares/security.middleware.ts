import cors from "cors";
import helmet from "helmet";
import slowDown from "express-slow-down";
import rateLimit from "express-rate-limit";
import express, { Express } from "express";

const hpp = require("hpp");

export const applySecurity = (app: Express) => {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );

  app.use(hpp());

  app.use(express.json({ limit: "10kb" }));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use(
    slowDown({
      windowMs: 15 * 60 * 1000,
      delayAfter: 50,
      delayMs: () => 500
    })
  );
};
