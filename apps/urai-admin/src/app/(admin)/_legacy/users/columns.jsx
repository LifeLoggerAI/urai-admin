'use client';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
export var columns = [
    {
        accessorKey: 'email',
        header: function (_a) {
            var column = _a.column;
            return (<Button variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>);
        },
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: function (_a) {
            var row = _a.row;
            return new Date(row.getValue('createdAt')).toLocaleDateString();
        },
    },
    {
        accessorKey: 'lastLoginAt',
        header: 'Last Login',
        cell: function (_a) {
            var row = _a.row;
            return (row.getValue('lastLoginAt') ? new Date(row.getValue('lastLoginAt')).toLocaleDateString() : 'Never');
        },
    },
    {
        id: 'actions',
        cell: function (_a) {
            var row = _a.row;
            var user = row.original;
            return (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={function () { return navigator.clipboard.writeText(user.id); }}>Copy user ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>);
        },
    },
];
