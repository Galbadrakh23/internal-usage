import { Request, Response } from "express";
import { getUsers } from "../services/user.services";
import { PrismaClient } from "@prisma/client";

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
