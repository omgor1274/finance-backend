import path from "path";
import express from "express";
import authRoutes from "./routes/auth.routes";
import billRoutes from "./routes/bill.routes";
import fundroutes from "./routes/funds.routes";
import usersRoutes from "./routes/users.routes";
import partyRoutes from "./routes/party.routes";
import searchRoutes from "./routes/search.routes";
import reportRoutes from "./routes/report.routes";
import vendorRoutes from "./routes/vendor.routes";
import invoiceRoutes from "./routes/invoice.routes";
import accountroutes from "./routes/account.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import attendanceRoutes from "./routes/attendance.routes";
import permissionRoutes from "./routes/permission.routes";
import bankAccountRoutes from "./routes/bankAccount.routes";
import notificationRoutes from "./routes/notification.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { applySecurity } from "./middlewares/security.middleware";

const app = express();
applySecurity(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/funds", fundroutes);
app.use("/api/bills", billRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/bank-accounts", bankAccountRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/account", accountroutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/home/search", searchRoutes);
app.use("/api/home/dashboard", dashboardRoutes);
app.use("/api/home/notifications", notificationRoutes);

app.use(errorHandler);

export default app;
