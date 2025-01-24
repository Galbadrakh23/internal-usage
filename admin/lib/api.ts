import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getUsers() {
  const response = await api.get("api/v1/users");
  return response.data;
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await api.post("api/v1/users", userData);
  return response.data;
}
