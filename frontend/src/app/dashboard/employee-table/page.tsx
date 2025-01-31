// import EmployeeTable from "@/components/features/employee-table/EmployeeTable";
// import { prisma } from "@/lib/prisma";
import Header from "@/components/layout_components/Header";
import React from "react";

const Employee = async () => {
  // const emoployeesData = await prisma.employees.findMany();
  return (
    <div className="mt-8">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 md:flex md:flex-col md:items-center md:justify-center border border-blue-50 mt-8 rounded-lg">
        <h2 className="mb-4 text-3xl font-semibold text-center md:text-3xl md:mb-8 ">
          Ажилчдын мэдээлэл
        </h2>
        {/* <EmployeeTable data={emoployeesData} /> */}
      </main>
    </div>
  );
};

export default Employee;
