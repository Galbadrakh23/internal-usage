"use server";

import { revalidatePath } from "next/cache";
import * as api from "@/lib/api";

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const newUser = await api.createUser(userData);
    revalidatePath("/api/users");
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getUsers() {
  try {
    return await api.getUsers();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users");
  }
}
