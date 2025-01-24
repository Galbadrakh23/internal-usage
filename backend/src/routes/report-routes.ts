import { Router, Request, Response, NextFunction } from "express";
import {
  getReportsByDate,
  createReport,
  createComment,
  uploadFile,
  updateReportStatus,
} from "../controllers/report.controller";

const router = Router();

// Route to get reports for a specific date
router.get(
  "/reports",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { date } = req.query; // Example: ?date=2025-01-22
      if (!date) {
        res.status(400).json({ error: "Date is required" });
        return;
      }
      await getReportsByDate(req, res, date as string);
    } catch (error) {
      next(error); // Passing the error to the global error handler
    }
  }
);

// Route to create a new report
router.post(
  "/reports",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { content, userId, date, status = "DRAFT" } = req.body;
      if (!content || !userId || !date) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      await createReport(req, res, content, userId, date, status);
    } catch (error) {
      next(error);
    }
  }
);

// Route to create a new comment for a report
router.post(
  "/reports/:reportId/comments",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { reportId } = req.params;
      const { content, userId } = req.body;
      if (!content || !userId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      await createComment(req, res, reportId, content, userId);
    } catch (error) {
      next(error);
    }
  }
);

// Route to upload a file to a report
router.post(
  "/reports/:reportId/files",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { reportId } = req.params;
      const { filename, path, mimeType, size } = req.body;
      if (!filename || !path || !mimeType || !size) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      await uploadFile(req, res, reportId, filename, path, mimeType, size);
    } catch (error) {
      next(error);
    }
  }
);

// Route to update report status
router.put(
  "/reports/:id/status",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body; // e.g., DRAFT, SUBMITTED, REVIEWED, APPROVED
      if (!status) {
        res.status(400).json({ error: "Status is required" });
        return;
      }
      await updateReportStatus(req, res, id, status);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
