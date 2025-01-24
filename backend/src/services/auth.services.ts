import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
// Create a new user
export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving it
  return await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};

export const validateUser = async (email: string, password: string) => {
  // Хэрэглгчийн и-мэйлээр хайх
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email");
  }
  // Хэрэглчийн оруулсан нууц үгийн хаш хийсэн нууц үгтэй харьцуулах.
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  // Return the user if validation is successful
  return user;
};
