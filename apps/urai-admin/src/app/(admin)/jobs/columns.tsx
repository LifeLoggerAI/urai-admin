'use client';

import { Job } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Job>();

export const columns = [
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('type', {
    header: 'Type',
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
];
