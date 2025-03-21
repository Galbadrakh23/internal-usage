import { Router } from "express";
import {
  getAllEmployees,
  createNewEmployee,
} from "../controllers/employee.controller";

const router = Router();

router.get("/employees", async (req, res) => {
  try {
    await getAllEmployees(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

router.post("/employees", async (req, res) => {
  try {
    await createNewEmployee(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to create employee" });
  }
});

export default router;
