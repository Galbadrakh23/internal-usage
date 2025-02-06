import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Get all Employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        phone: true,
        company: { select: { name: true } },
      },
    });
    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching users: ", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};
