import { Router } from "express";
import {
  getMealCountByDate,
  getRecentMeals,
  saveMealCount,
} from "../controllers/meal.controller";

const router = Router();

router.get("/meal-counts/:date", async (req, res) => {
  try {
    await getMealCountByDate(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meal count" });
  }
});

router.get("/meal-counts", async (req, res) => {
  try {
    await getRecentMeals(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent meals" });
  }
});
router.post("/meal-counts", async (req, res) => {
  try {
    await saveMealCount(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to save meal count" });
  }
});

export default router;
