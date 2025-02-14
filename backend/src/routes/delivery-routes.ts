import { Router } from "express";
import {
  getAllDeliveries,
  createDelivery,
  updateStatus,
  deleteDelivery,
} from "../controllers/delivery.controller";

const router = Router();

router.get("/deliveries", async (req, res) => {
  try {
    await getAllDeliveries(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

router.post("/deliveries", async (req, res) => {
  try {
    await createDelivery(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to create delivery" });
  }
});

router.patch("/deliveries/:id/status", async (req, res) => {
  try {
    await updateStatus(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

router.delete("/deliveries/:id", async (req, res) => {
  try {
    await deleteDelivery(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
