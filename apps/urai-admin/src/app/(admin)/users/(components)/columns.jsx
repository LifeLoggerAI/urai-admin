'use client';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { labels, priorities, statuses, } from './(data)/data';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
export var columns = [
    {
        id: 'select',
        header: function (_a) {
            var table = _a.table;
            return (<Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={function (value) { return table.toggleAllPageRowsSelected(!!value); }} aria-label="Select all" className="translate-y-[2px]"/>);
        },
        cell: function (_a) {
            var row = _a.row;
            return (<Checkbox checked={row.getIsSelected()} onCheckedChange={function (value) { return row.toggleSelected(!!value); }} aria-label="Select row" className="translate-y-[2px]"/>);
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: function (_a) {
            var column = _a.column;
            return (<DataTableColumnHeader column={column} title="Task"/>);
        },
        cell: function (_a) {
            var row = _a.row;
            return <div className="w-[80px]">{row.getValue('id')}</div>;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: function (_a) {
            var column = _a.column;
            return (<DataTableColumnHeader column={column} title="Title"/>);
        },
        cell: function (_a) {
            var row = _a.row;
            var label = labels.find(function (label) { return label.value === row.original.label; });
            return (<div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>);
        },
    },
    {
        accessorKey: 'status',
        header: function (_a) {
            var column = _a.column;
            return (<DataTableColumnHeader column={column} title="Status"/>);
        },
        cell: function (_a) {
            var row = _a.row;
            var status = statuses.find(function (status) { return status.value === row.getValue('status'); });
            if (!status) {
                return null;
            }
            return (<div className="flex w-[100px] items-center">
          {status.icon && (<status.icon className="mr-2 h-4 w-4 text-muted-foreground"/>)}
          <span>{status.label}</span>
        </div>);
        },
        filterFn: function (row, id, value) {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'priority',
        header: function (_a) {
            var column = _a.column;
            return (<DataTableColumnHeader column={column} title="Priority"/>);
        },
        cell: function (_a) {
            var row = _a.row;
            var priority = priorities.find(function (priority) { return priority.value === row.getValue('priority'); });
            if (!priority) {
                return null;
            }
            return (<div className="flex items-center">
          {priority.icon && (<priority.icon className="mr-2 h-4 w-4 text-muted-foreground"/>)}
          <span>{priority.label}</span>
        </div>);
        },
        filterFn: function (row, id, value) {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: 'actions',
        cell: function (_a) {
            var row = _a.row;
            return <DataTableRowActions row={row}/>;
        },
    },
];
