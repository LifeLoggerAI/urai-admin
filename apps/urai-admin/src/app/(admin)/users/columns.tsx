'use client';

import { AdminUser } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<AdminUser>();

export const columns = [
  columnHelper.accessor('email', {
    header: 'Email',
  }),
  columnHelper.accessor('uid', {
    header: 'User ID',
  }),
  columnHelper.accessor('isActive', {
    header: 'Active',
  }),
  columnHelper.accessor('role', {
    header: 'Role',
  }),
];
