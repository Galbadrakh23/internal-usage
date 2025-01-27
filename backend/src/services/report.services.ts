import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getReports = async () => {
  return await prisma.dailyReport.findMany();
};

// Create a new report
const createNewReport = async (currentUserId: string, content: string) => {
  try {
    const newReport = await prisma.dailyReport.create({
      data: {
        content: content,
        date: new Date(),
        userId: currentUserId,
      },
    });
    return newReport;
  } catch (error) {
    console.error("Error creating report: ", error);
    throw new Error("Error creating report");
  }
};

const getReportsByDate = async (startOfDay: Date, endOfDay: Date) => {
  try {
    const reports = await prisma.dailyReport.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });
    return reports;
  } catch (error) {
    console.error("Error fetching reports: ", error);
    throw new Error("Error fetching reports");
  }
};

export { createNewReport, getReportsByDate };
