import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await prisma.dailyReport.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        date: true,
        status: true,
        user: { select: { name: true, role: true } },
      },
    });
    return res.status(200).json(reports); // Send response back to client
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }); // Handle errors gracefully
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const deletedReport = await prisma.dailyReport.delete({
      where: { id: Number(req.params.id) },
    });
    return res
      .status(200)
      .json({ message: "Report deleted successfully", deletedReport });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting report" });
  }
};

export const createNewReport = async (req: Request, res: Response) => {
  const { title, content, userId, date, status } = req.body;
  try {
    const newReport = await prisma.dailyReport.create({
      data: {
        title,
        content,
        date: new Date(date),
        userId,
        status,
      },
    });
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: "Failed to Create Report" });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  const { title, content, status } = req.body;
  try {
    const updatedReport = await prisma.dailyReport.update({
      where: { id: Number(req.params.id) },
      data: { title, content, status },
    });
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: "Failed to Update Report" });
  }
};
