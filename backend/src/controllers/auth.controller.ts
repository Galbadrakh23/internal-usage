// controllers/authController.ts
import { Request, Response } from "express";
import {
  registerUser,
  authenticateUser,
  verifyToken,
} from "../services/auth.services";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await registerUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await authenticateUser(email, password);
  if (token) {
    const user = await prisma.user.findUnique({ where: { email } });
    res.cookie("token", token, { httpOnly: true });
    res.json({ token, userId: user?.id });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
};

export const verify = (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);
  if (decoded) {
    res.json({ message: "User verified", userId: decoded.userId });
  } else {
    res.status(401).json({ error: "Invalid token" });
  }
};
