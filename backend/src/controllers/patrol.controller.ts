import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client"; // ✅ Import Prisma

const prisma = new PrismaClient();

export const getAllPatrols = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters from query (default: page 1, limit 10)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Fetch patrols with pagination
    const patrols = await prisma.patrolCheck.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        notes: true,
        imagePath: true,
        status: true,
        totalCheckPoint: true,
        createdAt: true,
        user: { select: { name: true } },
        property: { select: { name: true } },
      },
    });

    // Get total count for pagination info
    const totalPatrols = await prisma.patrolCheck.count();

    res.status(200).json({
      data: patrols,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPatrols / limit),
        totalItems: totalPatrols,
        hasNextPage: offset + limit < totalPatrols,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching patrols:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get Patrol by ID
export const getPatrolById = async (req: Request, res: Response) => {
  try {
    const patrol = await prisma.patrolCheck.findUnique({
      where: { id: req.params.id },
      select: {
        notes: true,
        imagePath: true,
        status: true,
        totalCheckPoint: true,
        createdAt: true,
        user: { select: { name: true } },
        property: { select: { name: true } },
      },
    });

    if (!patrol) return res.status(404).json({ message: "Patrol not found" });
    res.status(200).json(patrol);
  } catch (error) {
    console.error("Error fetching patrol:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createPatrol = async (req: Request, res: Response) => {
  try {
    const {
      checkPoint,
      status,
      notes,
      checkedBy,
      propertyId,
      totalCheckPoint,
    } = req.body;

    // ✅ Validate required fields
    if (
      !checkPoint ||
      !status ||
      !checkedBy ||
      !propertyId ||
      totalCheckPoint === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const userExists = await prisma.user.findUnique({
      where: { id: checkedBy },
    });
    if (!userExists) {
      return res.status(400).json({ message: "invalid checkedBy ID" });
    }

    const newPatrolCheck = await prisma.patrolCheck.create({
      data: {
        checkPoint,
        status,
        notes: notes || null,
        checkedBy,
        propertyId,
        totalCheckPoint,
      },
    });

    res.status(201).json(newPatrolCheck);
  } catch (error) {
    console.error("Error creating patrol check:", error);

    // Prisma error handling
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res
        .status(400)
        .json({ message: "Database error", details: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Patrol
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Patrol ID and status are required",
      });
    }
    const updatePatrol = await prisma.patrolCheck.update({
      where: { id },
      data: { status },
    });
    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatePatrol,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

// ✅ Delete Patrol
export const deletePatrol = async (req: Request, res: Response) => {
  try {
    await prisma.patrolCheck.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Patrol deleted successfully" });
  } catch (error) {
    console.error("Error deleting patrol:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
