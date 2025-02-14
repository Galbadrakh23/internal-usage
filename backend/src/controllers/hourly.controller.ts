import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllHourly = async (req: Request, res: Response) => {
  try {
    const hourly = await prisma.hourlyActivity.findMany({
      select: {
        id: true,
        activity: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json(hourly);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createNewHourly = async (req: Request, res: Response) => {
  try {
    const { activity, title, date, userId } = req.body;

    // Simple validation
    if (!activity?.trim() || !title?.trim() || !date?.trim() || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields (activity, title, date, userId) are required",
      });
    }
    // Create new hourly report
    const hourly = await prisma.hourlyActivity.create({
      data: {
        activity,
        title,
        date: new Date(date),
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      data: hourly,
    });
  } catch (error) {
    console.error("Hourly activity creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create hourly activity",
    });
  }
};
