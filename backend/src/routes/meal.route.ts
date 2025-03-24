import { Router } from "express";
import {
  getMealCountByDate,
  getMealsCount,
  saveMealCount,
  updateMealCount,
} from "../controllers/meal.controller";

const router = Router();

router.get("/meal-counts", async (req, res) => {
  try {
    await getMealsCount(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meal counts" });
  }
});

router.get("/meal-counts/:date", async (req, res) => {
  try {
    await getMealCountByDate(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch meal count" });
  }
});

router.post("/meal-counts", async (req, res) => {
  try {
    await saveMealCount(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to save meal count" });
  }
});

router.patch("/meal-counts/:id", async (req, res) => {
  try {
    await updateMealCount(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update meal count" });
  }
});

export default router;
