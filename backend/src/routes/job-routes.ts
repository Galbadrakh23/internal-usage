import { Router } from "express";
import {
  getAllJobRequests,
  createJobRequest,
} from "../controllers/job.controller";
const router = Router();

router.get("/job-requests", async (req, res) => {
  try {
    await getAllJobRequests(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job requests" });
  }
});
router.post("/job-requests", async (req, res) => {
  try {
    await createJobRequest(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to create job request " });
  }
});

export default router;
