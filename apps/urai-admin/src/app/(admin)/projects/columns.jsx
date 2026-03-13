'use client';
import { createColumnHelper } from '@tanstack/react-table';
var columnHelper = createColumnHelper();
export var columns = [
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
