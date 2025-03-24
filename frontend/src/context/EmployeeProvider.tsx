"use client";
import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { apiUrl } from "@/utils/utils";
import { Employee, Company } from "@/interfaces/interface";

type EmployeeContextType = {
  employees: Employee[];
  companies: Company[];
  fetchEmployees: (page?: number) => Promise<void>;
  fetchCompanies: () => Promise<void>;
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
  companies: [],
  fetchEmployees: async () => {},
  fetchCompanies: async () => {},
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const limit = 25;

  const fetchEmployees = async (page = 1) => {
    try {
      setError(null);
      const response = await axios.get<{
        employees: Employee[];
        totalPages: number;
      }>(`${apiUrl}/api/employees?page=${page}&limit=${limit}`);

      setEmployees(response.data.employees);
      setPagination({
        currentPage: page,
        totalPages: response.data.totalPages,
      });
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
  }): Promise<void> => {
    try {
      setError(null);
      await axios.post(`${apiUrl}/api/employees`, employeeData);
      fetchEmployees(currentPage);
    } catch (err: unknown) {
      let errorMessage = "Failed to add employee. Please try again.";
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Error adding employee:", err);
      throw new Error(errorMessage);
    }
  };

  const fetchCompanies = async () => {
    try {
      setError(null);
      const response = await axios.get<{ companies: Company[] }>(
        `${apiUrl}/api/companies`
      );
      setCompanies(response.data.companies);
    } catch (err) {
      setError("Failed to fetch companies. Please try again.");
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        companies,
        employees,
        fetchEmployees,
        fetchCompanies,
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
