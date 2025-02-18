import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user-routes";
import reportRoutes from "./routes/report-routes";
import authRoutes from "./routes/auth-routes";
import hourlyRoutes from "./routes/hourly-routes";
import employeeRoutes from "./routes/employee-routes";
import deliveryRoutes from "./routes/delivery-routes";
import jobRequestRoutes from "./routes/job-routes";

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Frontend URL
  })
);
app.use(cookieParser());

app.use("/api/", userRoutes);
app.use("/api/", authRoutes);
app.use("/api/", reportRoutes);
app.use("/api/", hourlyRoutes);
app.use("/api/", employeeRoutes);
app.use("/api/", deliveryRoutes);
app.use("/api/", jobRequestRoutes);

export default app;
