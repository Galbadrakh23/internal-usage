import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAllJobRequests = async (req: Request, res: Response) => {
  try {
    const jobRequests = await prisma.jobRequest.findMany({
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
        user: {
          select: {
            name: true,
            role: true,
            email: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json(jobRequests);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new job request
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

    // Basic validation for required fields
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

    // Create new job request with default status as OPEN
    const jobRequest = await prisma.jobRequest.create({
      data: {
        title,
        description,
        priority,
        status: "OPEN", // Default status for new requests
        category,
        location,
        assignedTo,
        dueDate: dueDate ? new Date(dueDate) : null,
        requestedBy,
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

// Update a job request's status and handle completion date
export const updateJobRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      status,
      category,
      location,
      assignedTo,
      dueDate,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Job request ID is required",
      });
    }

    // Prepare update data
    const updateData: any = {
      ...(title && { title }),
      ...(description && { description }),
      ...(priority && { priority }),
      ...(status && { status }),
      ...(category && { category }),
      ...(location && { location }),
      ...(assignedTo && { assignedTo }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
    };

    // Add completedAt date if status is being set to COMPLETED
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    }

    const updatedJobRequest = await prisma.jobRequest.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Job request updated successfully",
      data: updatedJobRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job request",
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

// Add a comment to a job request
export const addJobRequestComment = async (req: Request, res: Response) => {
  try {
    const { content, userId } = req.body;
    const { jobRequestId } = req.params;

    if (!content?.trim() || !userId || !jobRequestId) {
      return res.status(400).json({
        success: false,
        message: "Content, user ID, and job request ID are required",
      });
    }

    const comment = await prisma.jobRequestComment.create({
      data: {
        content,
        userId,
        jobRequestId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};
