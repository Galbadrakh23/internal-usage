import { Request, Response } from "express";
import {
  createUser as createUserService,
  validateUser,
} from "../services/auth.services";
import { generateToken } from "../utils/jwt";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const userById: User | null = await prisma.user.findUnique({
      where: {
        id: "",
      },
    });
  } catch {}
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }
  try {
    const newUser = await createUserService(name, email, password);
    res
      .status(201)
      .json({ message: "User created successfully. Please log in." });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists." });
    }
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Failed to create new User" });
  } finally {
    await prisma.$disconnect();
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Validate the user credentials
    const user = await validateUser(email, password);
    // Generate a token for the user
    // const token = generateToken(user.id);
    res.status(200).json({ user, token: generateToken(user.id) });
  } catch (error) {
    res.status(401).json({ error: "Invalid email or password" });
  }
};
