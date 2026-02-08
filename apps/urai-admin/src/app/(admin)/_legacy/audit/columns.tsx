
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type AuditLog = {
  id: string;
  actorEmail: string;
  action: string;
  target: string;
  createdAt: Date;
};

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: 'actorEmail',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Actor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
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
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
  },
];
