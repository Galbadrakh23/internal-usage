import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use a real secret!

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
// Register a new user
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: Role
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

// Authenticate user and return token
export const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true, role: true },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }
  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

// Verify JWT token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
