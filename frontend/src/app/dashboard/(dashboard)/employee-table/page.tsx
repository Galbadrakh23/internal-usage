"use client";
import PageHeader from "@/components/layout_components/PageHeader";
import EmployeeInformationPanel from "@/components/features/employee-table/EmployeeTable";

export default function Employee() {
  return (
    <main className="flex-1 space-y-2">
      <div className="flex flex-col gap-2">
        <PageHeader title="Ажилтны мэдээлэл" />
      </div>
      <EmployeeInformationPanel />
      <div className="flex items-center justify-center"></div>
    </main>
  );
}
