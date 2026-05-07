'use client';
import { createColumnHelper } from '@tanstack/react-table';
var columnHelper = createColumnHelper();
export var columns = [
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
