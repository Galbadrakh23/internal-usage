import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Replace with your actual secret key

export interface UserPayload {
  username: string;
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as UserPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
