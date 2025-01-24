import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_TOKEN_PASSWORD = process.env.JWT_TOKEN_PASSWORD;

export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_TOKEN_PASSWORD || "", {
    expiresIn: "24h",
  });
};

export const decodeToken = (token: string) => {
  return jwt.verify(token, `${JWT_TOKEN_PASSWORD}` || "");
};
