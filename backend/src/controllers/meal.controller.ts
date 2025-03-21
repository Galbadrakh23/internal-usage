import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMealsCount = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const mealCounts = await prisma.mealCount.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        date: true,
        breakfast: true,
        lunch: true,
        dinner: true,
      },
    });
    // Get total count for pagination info
    const totalCount = await prisma.mealCount.count();
    res.status(200).json({
      data: mealCounts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch meal counts" });
  }
};

export const getMealCountByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const mealCount = await prisma.mealCount.findUnique({
      where: { date: new Date(date) },
    });

    if (!mealCount)
      return res
        .status(404)
        .json({ message: "No meal count found for this date" });
    return res.json(mealCount); // ✅ Always return a response
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch meal count" });
  }
};

export const getRecentMeals = async (_req: Request, res: Response) => {
  try {
    const recentMeals = await prisma.mealCount.findMany({
      orderBy: { date: "desc" },
      take: 7,
    });
    return res.json(recentMeals);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch recent meals" });
  }
};

export const saveMealCount = async (req: Request, res: Response) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;
    const mealCount = await prisma.mealCount.upsert({
      where: { date: new Date(date) },
      update: { breakfast, lunch, dinner },
      create: { date: new Date(date), breakfast, lunch, dinner },
    });
    return res.json(mealCount);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save meal count" });
  }
};

export const dailyMealCount = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const mealCount = await prisma.mealCount.findUnique({
      where: { date: new Date(date) },
    });

    if (!mealCount)
      return res
        .status(404)
        .json({ message: "No meal count found for this date" });

    return res.json(mealCount);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch meal count" });
  }
};
