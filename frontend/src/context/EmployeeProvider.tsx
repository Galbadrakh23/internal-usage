"use client";
import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { Employee } from "@/interface";

// Define context type
type EmployeeContextType = {
  employees: Employee[];
  fetchEmployees: (page?: number) => Promise<void>;
  addEmployee: (employeeData: {
    name: string;
    position: string;
    phone: string;
    companyId: string;
  }) => Promise<void>;
  pagination: { currentPage: number; totalPages: number };
  setCurrentPage: (page: number) => void;
  error: string | null;
};

export const EmployeeContext = createContext<EmployeeContextType>({
  employees: [],
  fetchEmployees: async () => {},
  addEmployee: async () => {},
  pagination: { currentPage: 1, totalPages: 1 },
  setCurrentPage: () => {},
  error: null,
});

export const EmployeeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Separate state for tracking page
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const limit = 25; // Fixed limit per page

  const fetchEmployees = async (page = 1) => {
    try {
      setError(null);
      const response = await axios.get<{
        employees: Employee[];
        totalPages: number;
      }>(`${apiUrl}/api/employees?page=${page}&limit=${limit}`);

      setEmployees(response.data.employees);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalPages: response.data.totalPages,
      }));
    } catch (err) {
      setError("Failed to fetch employees. Please try again.");
      console.error("Error fetching employees:", err);
    }
  };

  const addEmployee = async (employeeData: {
    name: string;
    position: string;
    phone: string;
    companyId: string;
  }) => {
    try {
      setError(null);
      await axios.post(`${apiUrl}/api/employees`, employeeData);
      fetchEmployees(currentPage); // Use currentPage for refetching
    } catch (err) {
      setError("Failed to add employee. Please try again.");
      console.error("Error adding employee:", err);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]); // Include only `currentPage` to satisfy ESLint

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        fetchEmployees,
        addEmployee,
        pagination,
        setCurrentPage,
        error,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
