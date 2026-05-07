'use client';
import { Checkbox } from '@/components/ui/checkbox';
export var columns = [
    {
        id: 'select',
        header: function (_a) {
            var table = _a.table;
            return (<Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={function (value) { return table.toggleAllPageRowsSelected(!!value); }} aria-label="Select all"/>);
        },
        cell: function (_a) {
            var row = _a.row;
            return (<Checkbox checked={row.getIsSelected()} onCheckedChange={function (value) { return row.toggleSelected(!!value); }} aria-label="Select row"/>);
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'queue',
        header: 'Queue',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'retries',
        header: 'Retries',
    },
];
