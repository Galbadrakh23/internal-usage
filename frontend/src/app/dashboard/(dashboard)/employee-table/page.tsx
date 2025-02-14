"use client";
import EmployeeTable from "@/components/features/employee-table/EmployeeTable";
import { EmployeeContext } from "@/context/EmployeeProvider";
import { useContext } from "react";

export default function Employee() {
  const { employees } = useContext(EmployeeContext);

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 md:flex md:flex-col md:items-center md:justify-center border border-blue-50 mt-8 rounded-lg">
      <EmployeeTable data={employees} />
    </main>
  );
}
