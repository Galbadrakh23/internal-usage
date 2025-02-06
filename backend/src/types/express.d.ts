import { User } from "@prisma/client"; // Import your User type if needed

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string; // Adjust based on your JWT payload
        role?: string; // Optional, if using roles
      };
    }
  }
}
