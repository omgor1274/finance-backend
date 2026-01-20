import express from "express";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { applySecurity } from "./middlewares/security.middleware";

const app = express();
applySecurity(app);

app.use(express.json());
app.use(express.urlencoded());
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);


export default app;
