import { Request, Response } from "express";
import { getUsers } from "../services/user.services";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserProfile = async (token: string) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Fetch user profile
    const userProfile = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!userProfile) {
      throw new Error("User not found");
    }

    return userProfile;
  } catch (error) {
    console.error("Profile verification error:", error);
    throw error;
  }
};
