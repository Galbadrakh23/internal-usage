import MainGrid from "@/components/features/main-grid/MainGrid";
import RecentActivity from "@/components/features/recent-activity/RecentActivity";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <MainGrid />
        <RecentActivity />
      </main>
    </div>
  );
}
