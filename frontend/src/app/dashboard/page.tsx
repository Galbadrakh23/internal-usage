import MainGrid from "@/components/features/main-grid/MainGrid";
import RecentActivity from "@/components/features/recent-activity/RecentActivity";
import Header from "@/components/layout_components/Header";

export default function Dashboard() {
  return (
    <div className="mt-8">
      <Header />
      <div className="flex flex-col min-h-screen p-8 border border-blue-50 rounded-lg mt-8">
        <MainGrid />
        <RecentActivity />
      </div>
      {/* Footer */}
      <footer className="text-center text-sm text-gray-500">
        <p>© 2025 Түрэлт LLC .</p>
      </footer>
    </div>
  );
}
