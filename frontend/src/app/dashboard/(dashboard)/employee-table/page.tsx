"use client";
import EmployeeTable from "@/components/features/employee-table/EmployeeTable";
import { EmployeeContext } from "@/context/EmployeeProvider";
import { useContext } from "react";
import PageHeader from "@/components/buttons/PageHeader";

export default function Employee() {
  const { employees } = useContext(EmployeeContext);

  return (
    <main className="flex-1 space-y-4">
      <div className="flex flex-col gap-4">
        <PageHeader title="Ажилтны мэдээлэл" />
      </div>
      <div className="mb-6 flex items-center gap-4">
        <EmployeeTable data={employees} />
      </div>
    </main>
  );
}
