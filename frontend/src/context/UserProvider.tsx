"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { User } from "@/interface";

interface UserContextType {
  user: User | null;
  userId: string;
  users: User[];
  isLoading: boolean;
  error: string;
  fetchUser: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  logout: () => Promise<void>;
  createUser: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Memoized fetchUser function
  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/verify`, {
        withCredentials: true,
      });
      setUser(data?.user || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized fetchUsers function
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/users`, {
        withCredentials: true,
      });
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchUsers();
  }, [fetchUser, fetchUsers]); // Runs only once due to useCallback

  const logout = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/verify/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const createUser = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    setError("");
    try {
      const { data } = await axios.post(`${apiUrl}/api/register`, {
        name,
        email,
        password,
        role,
      });
      setUsers((prev) => [...prev, data]);
    } catch (error) {
      setError("Failed to create user");
      console.error(error);
    }
  };
  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`${apiUrl}/api/users/${userId}`);
      await fetchUsers(); // Fetch updated user list after delete
    } catch (error) {
      setError("Failed to delete user");
      console.error(error);
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      await axios.put(`${apiUrl}/api/users/${userId}`, userData);
      await fetchUsers(); // Ensure fresh data is fetched
    } catch (error) {
      setError("Failed to update user");
      console.error(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userId: user?.id || "",
        users,
        isLoading,
        error,
        fetchUser,
        fetchUsers,
        logout,
        createUser,
        deleteUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
}
