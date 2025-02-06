import { Request, Response } from "express";
import {
  registerUser,
  authenticateUser,
  verifyToken,
} from "../services/auth.services";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const authResponse = await authenticateUser(email, password);

    res.cookie("token", authResponse.token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json(authResponse);
  } catch (error) {
    res.status(401).json({ error: "Invalid email or password" });
  }
};
export const verify = (req: Request, res: Response): void => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);
  if (decoded) {
    res.json({ message: "User verified", user: decoded });
  } else {
    res.status(401).json({ error: "Invalid token" });
  }
};
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};
