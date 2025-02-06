"use client";
import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { Employee } from "@/interface";

// Define the context type
type EmployeeContextType = {
  employees: Employee[]; // Use `employees` instead of `employee` for clarity
  fetchEmployee: () => Promise<void>;
};

// Create the context with proper initial values
export const EmployeeContext = createContext<EmployeeContextType>({
  employees: [], // Initialize as an empty array
  fetchEmployee: async () => {}, // Provide a default async function
});

// Define the provider component
export const EmployeeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]); // Use `employees` for clarity

  const fetchEmployee = async () => {
    try {
      const response = await axios.get<Employee[]>(`${apiUrl}/api/employees`);
      setEmployees(response.data); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployee(); // Fetch employees on component mount
  }, []);

  return (
    <EmployeeContext.Provider value={{ employees, fetchEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};
