import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get reports for a specific date
export const getReportsByDate = async (
  req: Request,
  res: Response,
  date: string
) => {
  try {
    const reports = await prisma.dailyReport.findMany({
      where: {
        date: {
          gte: new Date(date),
          lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
        },
      },
      include: {
        comments: true,
        files: true,
        user: true,
      },
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to load reports" });
  }
};

// Create a new report
export const createReport = async (
  req: Request,
  res: Response,
  content: string,
  userId: string,
  date: string,
  status: string
) => {
  try {
    const newReport = await prisma.dailyReport.create({
      data: {
        content,
        status: status as "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED",
        userId,
        date: new Date(date),
      },
    });
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: "Failed to create report" });
  }
};

// Create a new comment for a report
export const createComment = async (
  req: Request,
  res: Response,
  reportId: string,
  content: string,
  userId: string
) => {
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
        reportId: parseInt(reportId),
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// Upload a file to a report
export const uploadFile = async (
  req: Request,
  res: Response,
  reportId: string,
  filename: string,
  path: string,
  mimeType: string,
  size: number
) => {
  try {
    const newFile = await prisma.file.create({
      data: {
        filename,
        path,
        mimeType,
        size,
        reportId: parseInt(reportId),
      },
    });
    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload file" });
  }
};

// Optional: Update report status
export const updateReportStatus = async (
  req: Request,
  res: Response,
  id: string,
  status: string
) => {
  try {
    const updatedReport = await prisma.dailyReport.update({
      where: { id: parseInt(id) },
      data: {
        status: status as "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED",
      },
    });
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: "Failed to update report status" });
  }
};
