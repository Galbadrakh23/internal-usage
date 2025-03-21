"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/date-utils";

type MealCount = {
  id?: string;
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  employeeIds?: string[];
};

interface DataTableProps {
  data: MealCount[];
}

export function DataTable({ data }: DataTableProps) {
  // Sort data by date (newest first)
  const sortedData = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Огноо</TableHead>
            <TableHead className="text-right">Өглөөний цай</TableHead>
            <TableHead className="text-right">Өдрийн хоол</TableHead>
            <TableHead className="text-right">Оройн хоол</TableHead>
            <TableHead className="text-right">Нийт</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <TableRow key={item.id || item.date}>
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell className="text-right">{item.breakfast}</TableCell>
                <TableCell className="text-right">{item.lunch}</TableCell>
                <TableCell className="text-right">{item.dinner}</TableCell>
                <TableCell className="text-right font-medium">
                  {item.breakfast + item.lunch + item.dinner}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-4 text-muted-foreground"
              >
                Мэдээлэл байхгүй байна
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
