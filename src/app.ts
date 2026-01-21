import express from "express";
import authRoutes from "./routes/auth.routes";
import searchRoutes from "./routes/search.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import notificationRoutes from "./routes/notification.routes";
import partyRoutes from "./routes/party.routes";
import fundroutes from "./routes/funds.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { applySecurity } from "./middlewares/security.middleware";

const app = express();
applySecurity(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", fundroutes);
app.use("/api/auth", authRoutes);
app.use("/api/home", searchRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/home", dashboardRoutes);
app.use("/api/home", notificationRoutes);
app.use(errorHandler);

export default app;
