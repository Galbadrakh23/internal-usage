"use client";
import { EmployeeContext } from "@/context/EmployeeProvider";
import { useContext } from "react";
import MealCount from "@/components/features/meal-count/MealCount";
// import TureltEmployees from "@/components/features/employee-table/TureltEmployees";

export default function MealCountPage() {
  const { employees } = useContext(EmployeeContext);

  if (!employees || employees.length === 0) {
    return <div className="p-8">Loading employees...</div>;
  }

  return (
    <div className="p-8 rounded-lg mt-8">
      <div className="max-w-8xl space-y-4">
        <div className="mb-6 flex items-center gap-4">
          <MealCount />
          {/* <TureltEmployees
            data={employees.map((emp) => ({ ...emp, id: emp.id.toString() }))}
          /> */}
        </div>
      </div>
    </div>
  );
}
