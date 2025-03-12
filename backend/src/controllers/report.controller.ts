import { Request, Response } from "express";
import { PrismaClient, ReportStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      select: {
        id: true,
        title: true,
        activity: true,
        content: true,
        status: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createNewReport = async (req: Request, res: Response) => {
  try {
    const { title, activity, content, userId, date, status } = req.body;

    if (!title || !activity || !content || !userId || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReport = await prisma.report.create({
      data: {
        title,
        activity,
        content,
        userId,
        date: new Date(date),
        status: status as ReportStatus,
      },
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    return res.status(500).json({ message: "Failed to create report" });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { title, content, status, activity } = req.body;
    const reportId = Number(req.params.id);

    if (!reportId) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        title,
        content,
        activity,
        status: status as ReportStatus,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    return res.status(500).json({ message: "Failed to update report" });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const reportId = Number(req.params.id);

    if (!reportId) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const deletedReport = await prisma.report.delete({
      where: { id: reportId },
    });

    return res.status(200).json({
      message: "Report deleted successfully",
      deletedReport,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res.status(500).json({ message: "Error deleting report" });
  }
};
