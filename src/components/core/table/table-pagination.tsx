'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { useTableState } from '@/hooks/use-table-state';
import { Skeleton } from '@/components/ui/skeleton';
import Button from '../button';

interface TablePaginationProps<TData> {
  table: Table<TData>;
  tableState?: ReturnType<typeof useTableState>;
  totalCount: number;
  loading?: boolean;
}

export function TablePagination<TData>({
  table,
  tableState,
  totalCount,
  loading = false,
}: TablePaginationProps<TData>) {
  const pageSize = tableState?.tableState.pageSize || 10;
  const pageIndex = tableState?.tableState.pageIndex || 0;
  const pageCount = Math.ceil(totalCount / pageSize) || 1;

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    tableState?.setPagination(0, newPageSize);
  };

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex < 0 || newPageIndex >= pageCount) return;

    console.log('Changing page to:', newPageIndex);
    tableState?.setPagination(newPageIndex, pageSize);
  };

  const startItem = totalCount > 0 ? pageIndex * pageSize + 1 : 0;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalCount);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center space-x-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-muted-foreground text-sm">
        {totalCount > 0 ? (
          <>
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </>
        ) : null}
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6">
        {totalCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground text-sm font-medium">Rows per page</span>
            <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px] cursor-pointer">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top" align="end">
                {[10, 20, 30, 40, 50].map(size => (
                  <SelectItem key={size} value={`${size}`} className="cursor-pointer">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {totalCount > 0 && (
          <div className="text-muted-foreground flex items-center space-x-2 text-sm">
            <span className="font-medium">Page</span>
            <span className="text-foreground font-semibold">
              {pageIndex + 1} of {pageCount}
            </span>
          </div>
        )}

        {totalCount > 0 && (
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => handlePageChange(0)}
              disabled={pageIndex === 0}
              title="First page"
            >
              <ChevronFirst className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => handlePageChange(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
              title="Last page"
            >
              <ChevronLast className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
