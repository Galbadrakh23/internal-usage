"use client";

import { useContext, useState, useMemo } from "react";
import { EmployeeContext } from "@/context/EmployeeProvider";
import {
  DynamicTable,
  type TableColumn,
} from "@/components/data-table/DynamicTable";
import type { Employee } from "@/interfaces/interface";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { EmployeeModal } from "@/components/modals/EmployeeModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Pagination from "@/components/features/pagination/Pagination";

export default function EmployeeInformationPanel() {
  const { employees, addEmployee, companies } = useContext(EmployeeContext);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Fixed: Now search is used
  const pageSize = 25;

  const filteredEmployees = useMemo(() => {
    const companyFiltered =
      selectedCompany === "all"
        ? [...employees]
        : employees.filter(
            (employee) => employee.company.name === selectedCompany
          );

    const searchLower = searchTerm.toLowerCase();
    return companyFiltered
      .filter((employee) =>
        [
          employee.name,
          employee.position,
          employee.company.name,
          employee.phone,
        ].some((field) => field?.toLowerCase().includes(searchLower))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, selectedCompany, searchTerm]);

  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredEmployees.slice(startIndex, endIndex);

  const columns: TableColumn<Employee>[] = [
    { id: "name", header: "Нэр", accessorFn: (e) => e.name, searchable: true },
    {
      id: "position",
      header: "Албан тушаал",
      accessorFn: (e) => e.position,
      searchable: true,
    },
    {
      id: "department",
      header: "Компани",
      accessorFn: (e) => e.company.name,
      searchable: true,
    },
    {
      id: "phone",
      header: "Утас",
      accessorFn: (e) => e.phone,
      searchable: true,
    },
  ];

  const handleCompanyChange = (value: string) => {
    console.log("Selected company changed to:", value);
    setSelectedCompany(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const actionComponents = (
    <div className="flex items-center gap-4">
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addEmployee={addEmployee}
        companies={companies}
        onSuccess={() => setIsModalOpen(false)}
      />
      <Button variant="outline" onClick={() => setIsModalOpen(true)}>
        <Plus className="h-5 w-5" />
        Ажилтан нэмэх
      </Button>
    </div>
  );

  const selectCompany = (
    <Select value={selectedCompany} onValueChange={handleCompanyChange}>
      <SelectTrigger className="w-28">
        <SelectValue placeholder="Компани сонгох" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Бүгд</SelectItem>
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.name}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <>
      <DynamicTable
        data={currentItems}
        columns={columns}
        idField="id"
        isLoading={false}
        pageSize={pageSize}
        searchPlaceholder="Ажилтан хайх..."
        noDataMessage="Ажилтны мэдээлэл олдсонгүй"
        loadingMessage="Ажилтны мэдээлэл ачааллаж байна..."
        actionComponents={actionComponents}
        selectCompany={selectCompany}
        showSearch={true}
        onSearchChange={(value) => setSearchTerm(value)} // Fixed: Implemented search functionality
      />
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
