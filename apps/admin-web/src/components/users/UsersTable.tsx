
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from 'firebase/auth';

// This is a placeholder for the actual user data structure we'll get from Firestore
interface UraiUser extends User {
    customClaims?: {
        role: 'super_admin' | 'admin' | 'analyst' | 'moderator' | 'support' | 'viewer';
    };
    lastSeen?: string; // Should be a date string
    status?: 'Active' | 'Suspended' | 'Banned';
}

interface UsersTableProps {
  users: UraiUser[];
  onUserSelect: (user: UraiUser) => void;
}

const UsersTable = ({ users, onUserSelect }: UsersTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.uid}>
                        <TableCell>{user.uid}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Badge variant={user.customClaims?.role === 'super_admin' ? 'destructive' : 'secondary'}>
                                {user.customClaims?.role || 'N/A'}
                            </Badge>
                        </TableCell>
                        <TableCell>{user.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'N/A'}</TableCell>
                        <TableCell>
                            <Badge color={user.status === 'Active' ? 'green' : 'red'}>{user.status || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-8 w-8 p-0 flex items-center justify-center">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onUserSelect(user)}>View</DropdownMenuItem>
                                    <DropdownMenuItem>Suspend</DropdownMenuItem>
                                    <DropdownMenuItem>Shadow-Ban</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default UsersTable;
