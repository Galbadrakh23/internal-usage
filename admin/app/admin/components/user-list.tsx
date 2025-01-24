import { getUsers } from "../actions/user-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Define the User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function UserList() {
  try {
    const users: User[] = await getUsers();

    return (
      <ul className="space-y-2">
        {users.map((user: User) => (
          <li key={user.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{user.name}</h3>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">{user.email}</p>
              <Badge variant="outline">{user.role}</Badge>
            </div>
          </li>
        ))}
      </ul>
    );
  } catch {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load users. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
}
