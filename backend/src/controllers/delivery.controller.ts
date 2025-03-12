import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveries = await prisma.deliveryItem.findMany({
      select: {
        id: true,
        trackingNo: true,
        itemName: true,
        status: true,
        receiverName: true,
        senderName: true,
        senderPhone: true,
        location: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json(deliveries);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createDelivery = async (req: Request, res: Response) => {
  try {
    const {
      trackingNo,
      itemName,
      status,
      receiverName,
      receiverPhone,
      senderName,
      senderPhone,
      location,
      notes,
      userId,
    } = req.body;

    if (
      !trackingNo?.trim() ||
      !itemName?.trim() ||
      !receiverName?.trim() ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Create new delivery
    const delivery = await prisma.deliveryItem.create({
      data: {
        trackingNo,
        itemName,
        status,
        receiverName,
        receiverPhone,
        senderName,
        senderPhone,
        location,
        notes,
        userId,
      },
    });
    return res.status(201).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    console.error("Delivery creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create delivery",
    });
  }
};
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id is a string from params
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Delivery ID and status are required",
      });
    }
    const updatedDelivery = await prisma.deliveryItem.update({
      where: { id }, // If id is a string in the database
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedDelivery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};
export const deleteDelivery = async (req: Request, res: Response) => {
  try {
    const deleteDelivery = await prisma.deliveryItem.delete({
      where: { id: String(req.params.id) },
    });
    return res
      .status(200)
      .json({ message: "Report deleted successfully", deleteDelivery });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting report" });
  }
};
