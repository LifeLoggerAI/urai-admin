'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
export function DataTable(_a) {
    var _b;
    var columns = _a.columns, data = _a.data;
    var table = useReactTable({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (<div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(function (headerGroup) { return (<TableRow key={headerGroup.id}>
                {headerGroup.headers.map(function (header) { return (<TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>); })}
              </TableRow>); })}
          </TableHeader>
          <TableBody>
            {((_b = table.getRowModel().rows) === null || _b === void 0 ? void 0 : _b.length) ? (table.getRowModel().rows.map(function (row) { return (<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(function (cell) { return (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>); })}
                </TableRow>); })) : (<TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>);
}
