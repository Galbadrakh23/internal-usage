import { Request, Response, NextFunction } from "express";

interface IMyRequest extends Request {
  user?: TokenPayload;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

import { decodeToken } from "../utils/jwt";

interface TokenPayload {
  id: string;
  email: string;
  // Add other properties as needed
}
export const authentication = (
  req: IMyRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: "Та энэ үйлдлийг хийхийн тулд нэвтэрнэ үү" });
  }
  const token = req.headers.authorization.split(" ")[1];
  const user = decodeToken(token);
  if (user) {
    req.user = user as TokenPayload;
  } else {
    return res.status(401).json({ message: "Invalid token" });
  }

  next();
};
