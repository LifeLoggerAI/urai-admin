'use client';
import { createColumnHelper } from '@tanstack/react-table';
var columnHelper = createColumnHelper();
export var columns = [
    columnHelper.accessor('status', {
        header: 'Status',
    }),
    columnHelper.accessor('type', {
        header: 'Type',
    }),
    columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: function (info) { return new Date(info.getValue()).toLocaleString(); },
    }),
];
