import { Router } from "express";
import {
  getAllHourly,
  createNewHourly,
} from "../controllers/hourly.controller";

const router = Router();

router.get("/hourly", async (req, res) => {
  try {
    await getAllHourly(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hourly activities" });
  }
});

router.post("/hourly", async (req, res) => {
  try {
    await createNewHourly(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to create hourly activity" });
  }
});

export default router;
