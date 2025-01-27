import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_TOKEN_PASSWORD = process.env.JWT_TOKEN_PASSWORD;

if (!JWT_TOKEN_PASSWORD) {
  throw new Error(
    "JWT_TOKEN_PASSWORD is not defined in the environment variables"
  );
}

interface TokenPayload {
  id: string;
  email: string;
  // Add other fields as necessary
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_TOKEN_PASSWORD, {
    expiresIn: "24h",
  });
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_TOKEN_PASSWORD) as TokenPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
