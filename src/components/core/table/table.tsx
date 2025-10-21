'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTableState } from '@/hooks/use-table-state';
import { cn } from '@/lib/utils';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { TablePagination } from './table-pagination';
import { ActionButton, TableToolbar, ToolbarFilter } from './table-toolbar';
import { Skeleton } from '@/components/ui/skeleton';

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  totalCount?: number;
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: ToolbarFilter[];
  defaultPageSize?: number;
  actions?: ActionButton[];
  heading?: string;
  onSearch?: (value: string) => void;
  tableState?: ReturnType<typeof useTableState>;
  loading?: boolean;
  showClearButton?: boolean;
  emptyText?: string;
}

const TableRowSkeleton = ({ columns, rows = 5 }: { columns: number; rows?: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-${rowIndex}`} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default function Table<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  filters,
  actions,
  heading,
  totalCount = 0,
  defaultPageSize = 10,
  tableState,
  loading = false,
  showClearButton = true,
  emptyText = "No results found",
}: TableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / (tableState?.tableState.pageSize || defaultPageSize)),
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <Card className="relative overflow-hidden border border-gray-100 shadow-lg">
      <CardContent className="rounded-2xl p-0 pt-4">
        {heading && (
          <h1 className={cn('px-4 text-xl font-medium', heading ? 'mb-4' : 'mb-0')}>{heading}</h1>
        )}

        <TableToolbar
          table={table}
          actions={actions}
          filters={filters}
          tableState={tableState}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          showClearButton={showClearButton}
        />

        <div className="py-4">
          <div className="overflow-x-auto">
            <ShadcnTable>
              <TableHeader className="h-[3rem] bg-[#F4F6F8]">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRowSkeleton
                    columns={columns.length}
                    rows={tableState?.tableState.pageSize || defaultPageSize}
                  />
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="transition-all duration-200 hover:bg-gray-50/50"
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const shouldWrap = index === 1 || index === 3 || index === 4 || index === 6;
                        return (
                          <TableCell
                            key={cell.id}
                            className={` ${shouldWrap ? 'max-w-[130px] min-w-[130px] break-words whitespace-normal' : ''} `}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="text-muted-foreground flex flex-col items-center justify-center">
                        <div className="mb-2 text-lg font-medium">{emptyText}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ShadcnTable>
          </div>

          <TablePagination
            table={table}
            tableState={tableState}
            totalCount={totalCount}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
