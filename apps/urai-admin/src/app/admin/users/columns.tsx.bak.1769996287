'use client';

import { ROLES } from "@/lib/auth";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { adminSetUserRole } from "@/lib/firebase";
import { logAdminAction } from "@/lib/audit";

export type User = {
  id: string;
  email: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      const handleRoleChange = async (role: string) => {
        await adminSetUserRole({ uid: user.id, role });
        await logAdminAction('set_user_role', `Set role for user ${user.email} to ${role}`);
        // Ideally, you would refresh the data here
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRoleChange(ROLES.a)}>Set as Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleChange(ROLES.s)}>Set as Staff</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleChange(ROLES.v)}>Set as Viewer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
