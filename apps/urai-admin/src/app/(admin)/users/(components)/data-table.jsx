'use client';
import * as React from 'react';
import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
export function DataTable(_a) {
    var _b;
    var columns = _a.columns, data = _a.data;
    var _c = React.useState({}), rowSelection = _c[0], setRowSelection = _c[1];
    var _d = React.useState({}), columnVisibility = _d[0], setColumnVisibility = _d[1];
    var _e = React.useState([]), columnFilters = _e[0], setColumnFilters = _e[1];
    var _f = React.useState([]), sorting = _f[0], setSorting = _f[1];
    var table = useReactTable({
        data: data,
        columns: columns,
        state: {
            sorting: sorting,
            columnVisibility: columnVisibility,
            rowSelection: rowSelection,
            columnFilters: columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });
    return (<div className="space-y-4">
      <DataTableToolbar table={table}/>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(function (headerGroup) { return (<TableRow key={headerGroup.id}>
                {headerGroup.headers.map(function (header) {
                return (<TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>);
            })}
              </TableRow>); })}
          </TableHeader>
          <TableBody>
            {((_b = table.getRowModel().rows) === null || _b === void 0 ? void 0 : _b.length) ? (table.getRowModel().rows.map(function (row) { return (<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(function (cell) { return (<TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>); })}
                </TableRow>); })) : (<TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table}/>
    </div>);
}
