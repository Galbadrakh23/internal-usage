"use client";

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";

type User = { userId: string; name: string; email: string } | null;

type UserContextType = {
  user: User;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  fetchUser: async () => {},
  logout: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/verify`, {
        withCredentials: true,
      });
      setUser(data?.user || null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Unauthorized: Logging out user.");
      } else {
        console.error("Error fetching user:", error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
