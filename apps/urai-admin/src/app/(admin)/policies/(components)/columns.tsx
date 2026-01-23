'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Policy = {
  id: string;
  name: string;
  version: string;
};

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'version',
    header: 'Version',
  },
];
