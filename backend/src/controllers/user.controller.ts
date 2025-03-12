import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const relatedRequests = await prisma.jobRequest.findMany({
      where: { requestedBy: id },
    });

    if (relatedRequests.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete user with active job requests" });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
};
