import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user-routes";
import reportRoutes from "./routes/report-routes";
import authRoutes from "./routes/auth-routes";

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", userRoutes);
app.use("/api/v1", reportRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", reportRoutes);

export default app;
