'use client';

import { ColumnDef } from "@tanstack/react-table";

export type AuditLog = {
  id: string;
  adminId: string;
  action: string;
  timestamp: any;
  details: string;
};

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "adminId",
    header: "Admin ID",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const log = row.original;
      return new Date(log.timestamp.seconds * 1000).toLocaleString();
    }
  },
  {
    accessorKey: "details",
    header: "Details",
  },
];
