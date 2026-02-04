'use client';

import { ProjectRegistry } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ProjectRegistry>();

export const columns = [
  columnHelper.accessor('projectId', {
    header: 'Project ID',
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('description', {
    header: 'Description',
  }),
];
