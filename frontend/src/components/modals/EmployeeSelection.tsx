"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Employee } from "@/interface";

type EmployeeSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  allEmployees: Employee[];
  selectedEmployees: Employee[];
  onSelectionChange: (employees: Employee[]) => void;
};

export function EmployeeSelectionModal({
  isOpen,
  onClose,
  allEmployees,
  selectedEmployees,
  onSelectionChange,
}: EmployeeSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedEmployees, setLocalSelectedEmployees] = useState<
    Employee[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedEmployees(selectedEmployees);
    }
  }, [isOpen, selectedEmployees]);

  // Filter employees based on search term
  const filteredEmployees = allEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (id: string) => {
    return localSelectedEmployees.some((emp) => emp.id === id);
  };

  const toggleEmployee = (employee: Employee) => {
    if (isSelected(employee.id)) {
      setLocalSelectedEmployees(
        localSelectedEmployees.filter((emp) => emp.id !== employee.id)
      );
    } else {
      setLocalSelectedEmployees([...localSelectedEmployees, employee]);
    }
  };

  const selectAllVisible = () => {
    const newSelection = [...localSelectedEmployees];

    filteredEmployees.forEach((employee) => {
      if (!isSelected(employee.id)) {
        newSelection.push(employee);
      }
    });

    setLocalSelectedEmployees(newSelection);
  };

  // Deselect all visible employees
  const deselectAllVisible = () => {
    const visibleIds = new Set(filteredEmployees.map((emp) => emp.id));
    setLocalSelectedEmployees(
      localSelectedEmployees.filter((emp) => !visibleIds.has(emp.id))
    );
  };

  const handleSave = () => {
    onSelectionChange(localSelectedEmployees);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ажилчид сонгох</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />

          <div className="flex justify-between mb-2">
            <Button variant="outline" size="sm" onClick={selectAllVisible}>
              Бүгдийг сонгох
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAllVisible}>
              Бүгдийг цуцлах
            </Button>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-muted"
                >
                  <Checkbox
                    id={`employee-${employee.id}`}
                    checked={isSelected(employee.id)}
                    onCheckedChange={() => toggleEmployee(employee)}
                  />
                  <Label
                    htmlFor={`employee-${employee.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.company.name}
                    </div>
                  </Label>
                </div>
              ))}

              {filteredEmployees.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Ажилчид олдсонгүй
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Цуцлах
            </Button>
            <Button onClick={handleSave}>
              Хадгалах ({localSelectedEmployees.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
