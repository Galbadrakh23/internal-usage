import { addDays, format } from "date-fns";

export interface Report {
  id: string;
  date: string;
  hours: number;
  project: string;
}

export function generateMockReports(date: Date): Report[] {
  const reports: Report[] = [];
  for (let i = 0; i < 5; i++) {
    const reportDate = addDays(date, -i);
    reports.push({
      id: `report-${i}`,
      date: format(reportDate, "yyyy-MM-dd"),
      hours: Math.floor(Math.random() * 8) + 1,
      project: `Project ${String.fromCharCode(65 + i)}`,
    });
  }
  return reports;
}
