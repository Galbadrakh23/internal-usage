import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.services";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res
      .status(403)
      .json({ error: "Forbidden: Invalid or expired token" });
  }

  (req as any).user = decoded; // Attach user info to request
  next();
};
