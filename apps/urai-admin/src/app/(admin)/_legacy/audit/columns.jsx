'use client';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
export var columns = [
    {
        accessorKey: 'actorEmail',
        header: function (_a) {
            var column = _a.column;
            return (<Button variant="ghost" onClick={function () { return column.toggleSorting(column.getIsSorted() === 'asc'); }}>
          Actor
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>);
        },
    },
    {
        accessorKey: 'action',
        header: 'Action',
    },
    {
        accessorKey: 'target',
        header: 'Target',
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: function (_a) {
            var row = _a.row;
            return new Date(row.getValue('createdAt')).toLocaleString();
        },
    },
];
