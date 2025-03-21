import MainGrid from "@/components/features/main-grid/MainGrid";
import RecentActivity from "@/components/features/recent-activity/RecentActivity";
import { CalendarDays } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow px-10">
        <div className="py-4">
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <CalendarDays className="h-5 w-5" />
            <MongolianDate />
          </div>
        </div>
        <MainGrid />
        <RecentActivity />
      </main>
    </div>
  );
}

function MongolianDate() {
  const now = new Date();

  // Get date components
  const year = now.getFullYear();
  const day = now.getDate();

  // Mongolian month names with proper suffixes
  const mongolianMonths = [
    "Нэгдүгээр",
    "Хоёрдугаар",
    "Гуравдугаар",
    "Дөрөвдүгээр",
    "Тавдугаар",
    "Зургадугаар",
    "Долдугаар",
    "Наймдугаар",
    "Есдүгээр",
    "Аравдугаар",
    "Арван нэгдүгээр",
    "Арван хоёрдугаар",
  ];

  // Mongolian weekday names
  const mongolianWeekdays = [
    "Ням",
    "Даваа",
    "Мягмар",
    "Лхагва",
    "Пүрэв",
    "Баасан",
    "Бямба",
  ];

  const month = mongolianMonths[now.getMonth()];
  const weekday = mongolianWeekdays[now.getDay()];
  // Format: "2025 оны Гуравдугаар сарын 20, Пүрэв"
  const formattedDate = `${year} оны ${month} сарын ${day}, ${weekday}`;
  return (
    <div className="">
      <span className="">{formattedDate}</span>
    </div>
  );
}
