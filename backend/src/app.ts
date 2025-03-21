import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user-routes";
import reportRoutes from "./routes/report-routes";
import authRoutes from "./routes/auth-routes";
import employeeRoutes from "./routes/employee-routes";
import deliveryRoutes from "./routes/delivery-routes";
import jobRequestRoutes from "./routes/job-routes";
import patrolCheckRoutes from "./routes/patrol-routes";
import mealRoutes from "./routes/meal.route";
import mainRoutes from "./routes/main-routes";

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/", userRoutes);
app.use("/api/", reportRoutes);
app.use("/api/", authRoutes);
app.use("/api/", reportRoutes);
app.use("/api/", employeeRoutes);
app.use("/api/", deliveryRoutes);
app.use("/api/", jobRequestRoutes);
app.use("/api/", patrolCheckRoutes);
app.use("/api/", mealRoutes);
app.use("/api/", mainRoutes);

export default app;
