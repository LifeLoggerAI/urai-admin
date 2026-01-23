'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
};

export const columns: ColumnDef<AuditEvent>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'actor',
    header: 'Actor',
  },
  {
    accessorKey: 'action',
    header: 'Action',
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
  },
];
