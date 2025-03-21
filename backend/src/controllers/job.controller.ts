import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAllJobRequests = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const jobRequests = await prisma.jobRequest.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        category: true,
        location: true,
        assignedTo: true,
        dueDate: true,
        completedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // Get total count for pagination info
    const totalJobRequests = await prisma.jobRequest.count();

    res.status(200).json({
      data: jobRequests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalJobRequests / limit),
        totalItems: totalJobRequests,
        hasNextPage: offset + limit < totalJobRequests,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching Job Requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createJobRequest = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      priority,
      category,
      location,
      assignedTo,
      dueDate,
      requestedBy,
    } = req.body;

    // Validate required fields
    if (
      !title?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      !requestedBy
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Validate priority enum
    const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority value",
      });
    }

    const jobRequest = await prisma.jobRequest.create({
      data: {
        title,
        description,
        priority,
        status: "OPEN", // Default status
        category,
        location,
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        requestedBy: requestedBy || null,
      },
    });

    return res.status(201).json({
      success: true,
      data: jobRequest,
    });
  } catch (error) {
    console.error("Job request creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job request",
    });
  }
};

export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "CANCELED", "COMPLETED"];
    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Job request ID and status are required",
      });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed statuses: PENDING, CANCELED, COMPLETED",
      });
    }

    console.log("Updating job ID:", id, "to status:", status); // Debugging log

    // Use Prisma.DbNull for `NULL`
    const updateData: any = { status, completedAt: null };
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    }

    const updatedJobRequest = await prisma.jobRequest.update({
      where: { id },
      data: updateData,
    });

    console.log("Updated job request:", updatedJobRequest); // Debugging log

    return res.status(200).json({
      success: true,
      message: `Job status updated to ${status} successfully`,
      data: updatedJobRequest,
    });
  } catch (error) {
    console.error("Prisma update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a job request
export const deleteJobRequest = async (req: Request, res: Response) => {
  try {
    const deletedJobRequest = await prisma.jobRequest.delete({
      where: { id: String(req.params.id) },
    });
    return res.status(200).json({
      message: "Job request deleted successfully",
      deletedJobRequest,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting job request" });
  }
};
