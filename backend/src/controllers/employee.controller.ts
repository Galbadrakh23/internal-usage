import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const companyName = req.query.company as string | undefined;

    const filters: any = {};
    if (companyName && companyName !== "all") {
      filters.company = { name: companyName };
    }

    const employees = await prisma.employee.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        position: true,
        phone: true,
        company: { select: { name: true } },
      },
    });

    const totalEmployees = employees.length;

    return res.status(200).json({
      employees,
      totalEmployees,
    });
  } catch (error) {
    console.error("Error fetching employees: ", error);
    return res.status(500).json({ error: "Failed to fetch employees" });
  }
};

export const createNewEmployee = async (req: Request, res: Response) => {
  try {
    const { name, position, phone, companyId } = req.body;
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        position,
        phone,
        company: { connect: { id: companyId } },
      },
    });
    return res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee: ", error);
    return res.status(500).json({ error: "Failed to create employee" });
  }
};
