import MainGrid from "@/components/features/main-grid/MainGrid";
import RecentActivity from "@/components/features/recent-activity/RecentActivity";

export default function Dashboard() {
  return (
    <main>
      <MainGrid />
      <RecentActivity />
      {/* Footer */}
      <footer className="text-center text-sm text-gray-500">
        <p>© 2025 Түрэлт LLC .</p>
      </footer>
    </main>
  );
}
