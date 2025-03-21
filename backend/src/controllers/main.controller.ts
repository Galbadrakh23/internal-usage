import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch counts for current date
    const [employees, reports, deliveries, patrols, mealCounts, jobRequests] =
      await Promise.all([
        prisma.employee.count(), // Get total employees count across all companies
        prisma.report.count({
          where: { createdAt: { gte: today, lt: tomorrow } },
        }),
        prisma.deliveryItem.count({
          where: { createdAt: { gte: today, lt: tomorrow } },
        }),
        prisma.patrolCheck.count({
          where: { createdAt: { gte: today, lt: tomorrow } },
        }),
        prisma.mealCount.count({
          where: { createdAt: { gte: today, lt: tomorrow } },
        }),
        prisma.jobRequest.count({
          where: { createdAt: { gte: today, lt: tomorrow } },
        }),
      ]);

    res.json({
      employees, // Now includes employees from all companies
      reports,
      deliveries,
      patrols,
      mealCounts,
      jobRequests,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
