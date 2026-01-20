
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MoreVertical } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'analyst' | 'moderator' | 'support' | 'viewer';
  status: 'active' | 'suspended' | 'shadow-banned';
  lastActive: string;
};

const dummyUsers: User[] = [
  { id: 'usr_001', name: 'John Doe', email: 'john.doe@example.com', role: 'admin', status: 'active', lastActive: '2 hours ago' },
  { id: 'usr_002', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'super_admin', status: 'active', lastActive: '5 minutes ago' },
  { id: 'usr_003', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'support', status: 'suspended', lastActive: '3 days ago' },
  { id: 'usr_004', name: 'Mary Williams', email: 'mary.williams@example.com', role: 'viewer', status: 'active', lastActive: '1 week ago' },
  { id: 'usr_005', name: 'David Brown', email: 'david.brown@example.com', role: 'moderator', status: 'shadow-banned', lastActive: '30 minutes ago' },
];

export default function UsersPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users by name, email, or role" className="pl-8" />
            </div>
            <Button>Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
