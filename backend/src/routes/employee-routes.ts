import { Router } from "express";
import { getAllEmployees } from "../controllers/employee.controller";

const router = Router();

router.get("/employees", async (req, res) => {
  try {
    await getAllEmployees(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

export default router;
