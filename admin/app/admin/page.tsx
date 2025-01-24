import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Logged in User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center space-x-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium"></span>
                <span className="text-xs text-muted-foreground"></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
