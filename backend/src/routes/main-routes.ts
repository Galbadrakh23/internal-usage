import { Router } from "express";
import { getDashboardData } from "../controllers/main.controller";

const router = Router();

router.get("/dashboard", async (req, res) => {
  try {
    await getDashboardData(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;
