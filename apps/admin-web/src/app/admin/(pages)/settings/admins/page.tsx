
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search } from "lucide-react";
import withAuth from '@/components/withAuth';

const adminUsers = [
  { id: 'adm_001', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'super_admin', createdAt: '2023-01-15' },
  { id: 'adm_002', name: 'John Doe', email: 'john.doe@example.com', role: 'admin', createdAt: '2023-03-22' },
  { id: 'adm_003', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'support', createdAt: '2023-08-10' },
];

function AdminManagementPage() {

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>
      <Card className="bg-gray-800/50 border-gray-700 text-white">
        <CardHeader>
            <CardTitle>All Administrators</CardTitle>
             <div className="flex items-center space-x-2 pt-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or email" className="pl-8 bg-gray-900 border-gray-700" />
                </div>
                <Button><UserPlus className="mr-2 h-4 w-4"/> Add New Admin</Button>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select value={user.role}>
                      <SelectTrigger className="w-[120px] bg-gray-900 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                         <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm">Remove</Button>
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

export default withAuth(AdminManagementPage, ['super_admin']);
