"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MealCount from "../meal-count/MealCount";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  company: {
    name: string;
  };
  phone: string;
  isAvailable?: boolean;
}

interface TureltEmployeeTableProps {
  data: Employee[];
  onAvailableCountChange?: (count: number) => void;
}

const TureltEmployeeTable: React.FC<TureltEmployeeTableProps> = ({
  data,
  onAvailableCountChange,
}) => {
  const ITEMS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [showMealCount, setShowMealCount] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [employees, setEmployees] = useState(
    data
      .filter((emp) => emp.company.name === "Түрэлт")
      .map((emp) => ({
        ...emp,
        isAvailable: true,
      }))
  );

  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = employees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    const availableCount = employees.filter((emp) => emp.isAvailable).length;
    onAvailableCountChange?.(availableCount);
  }, [employees, onAvailableCountChange]);

  const toggleAvailability = (employeeId: string) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === employeeId ? { ...emp, isAvailable: !emp.isAvailable } : emp
      )
    );
  };

  const handlePrint = () => {
    setShowMealCount(true);
  };

  const handleCloseMealCount = () => {
    setShowMealCount(false);
  };

  const handleActualPrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;

    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore React functionality
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Ажилтны жагсаалт</CardTitle>
          <Button
            variant="outline"
            className="hover:bg-gray-100 transition-colors duration-200"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" />
            Хэвлэх
          </Button>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Ажилтны мэдээлэл олдсонгүй.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border px-4 py-2 text-left text-xs font-semibold text-gray-700">
                        №
                      </th>
                      <th className="border px-4 py-2 text-left text-xs font-semibold text-gray-700">
                        Ажилтны нэр
                      </th>
                      <th className="border px-4 py-2 text-left text-xs font-semibold text-gray-700">
                        Албан тушаал
                      </th>
                      <th className="border px-4 py-2 text-center text-xs font-semibold text-gray-700">
                        Байгаа эсэх
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.map((employee, index) => (
                      <tr
                        key={employee.id}
                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                          !employee.isAvailable ? "bg-gray-100" : ""
                        }`}
                      >
                        <td className="border px-4 py-2 text-sm text-gray-700">
                          {startIndex + index + 1}
                        </td>
                        <td className="border px-4 py-2 text-sm font-medium text-gray-900">
                          {employee.name}
                        </td>
                        <td className="border px-4 py-2 text-sm text-gray-700">
                          {employee.position}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <Badge
                            variant={
                              employee.isAvailable ? "default" : "success"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleAvailability(employee.id)}
                          >
                            {employee.isAvailable ? "Байгаа" : "Байхгүй"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Нийт: {employees.length} ажилтан | Байгаа:{" "}
                  {employees.filter((emp) => emp.isAvailable).length} | Байхгүй:{" "}
                  {employees.filter((emp) => !emp.isAvailable).length}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showMealCount} onOpenChange={setShowMealCount}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Хоолны тооцоо</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleActualPrint}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Хэвлэх
                </Button>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseMealCount}
                    className="flex items-center gap-2"
                  ></Button>
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div ref={printRef}>
            <div className="print-content">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">
                  {new Date().toLocaleDateString("mn-MN")}
                </h2>
                <div className="text-lg mb-6">
                  Нийт ирсэн ажилтан:{" "}
                  <span className="font-semibold">
                    {employees.filter((emp) => emp.isAvailable).length}
                  </span>
                </div>
              </div>
              <MealCount />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}</style>
    </>
  );
};

export default TureltEmployeeTable;
