import { Router } from "express";
import {
  getAllReports,
  createNewReport,
  deleteReport,
  updateReport,
} from "../controllers/report.controller";

const router = Router();

router.get("/reports", async (req, res) => {
  try {
    await getAllReports(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

router.post("/reports", async (req, res) => {
  try {
    await createNewReport(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to create report" });
  }
});
router.delete("/reports/:id", async (req, res) => {
  try {
    await deleteReport(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete report" });
  }
});
router.put("/reports/:id", async (req, res) => {
  try {
    await updateReport(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update report" });
  }
});
export default router;
