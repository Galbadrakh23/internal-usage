import { Router } from "express";
import {
  getAllPatrols,
  createPatrol,
  getPatrolById,
  updateStatus,
  deletePatrol,
} from "../controllers/patrol.controller";

const router = Router();

// 🟢 Get all patrols
router.get("/patrols", async (req, res) => {
  try {
    await getAllPatrols(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patrols" });
  }
});

// 🔵 Create a new patrol
router.post("/patrols", async (req, res) => {
  try {
    await createPatrol(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to create patrol" });
  }
});

// 🟠 Get a single patrol by ID
router.get("/patrols/:id", async (req, res) => {
  try {
    await getPatrolById(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patrol" });
  }
});

// 🟡 Update a patrol by ID
router.put("/patrols/:id", async (req, res) => {
  try {
    await updateStatus(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update patrol" });
  }
});

// 🟡 Update patrol status
router.patch("/patrols/:id", async (req, res) => {
  try {
    await updateStatus(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update patrol status" });
  }
});

// 🔴 Delete a patrol by ID
router.delete("/patrols/:id", async (req, res) => {
  try {
    await deletePatrol(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete patrol" });
  }
});

export default router;
