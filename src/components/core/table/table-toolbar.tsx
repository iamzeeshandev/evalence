'use client';

import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Button, { ButtonProps } from '../button';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { TableDateFilter } from './table-date-filter';
import { TableFacetedFilter } from './table-faceted-filter';
import { useTableState } from '@/hooks/use-table-state';
import { TableSelectFilter } from './table-select-filter';
import { NestedOption, TableNestedSelectFilter } from './table-nested-select-filter';
import { Label } from '@/components/ui/label';

export type CalendarMode = 'single' | 'multiple' | 'range';
export type ToolbarFilter = {
  type: string | 'search' | 'select' | 'date' | 'custom';
  columnId: string;
  placeholder?: string;
  title?: string;
  mode?: CalendarMode;
  options?: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[];
  nestedOptions?: NestedOption[];
  render?: (props: { column: any; table: Table<any> }) => ReactNode;
};

export type ActionButton = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  disabled?: boolean;
};
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: ToolbarFilter[];
  actions?: ActionButton[];
  searchKey?: string;
  searchPlaceholder?: string;
  showColumnVisibilityToggle?: boolean;
  className?: string;
  onSearch?: (value: string) => void;
  tableState?: ReturnType<typeof useTableState>;
  showClearButton?: boolean;
}

export function TableToolbar<TData>({
  table,
  filters = [],
  actions = [],
  searchKey,
  searchPlaceholder,
  showColumnVisibilityToggle = true,
  className,
  tableState,
  showClearButton,
}: DataTableToolbarProps<TData>) {
  const activeFilters = filters.filter(filter => {
    if (filter.type === 'search') {
      return !!table.getColumn(filter.columnId)?.getFilterValue();
    }
    if (filter.type === 'select') {
      const value = table.getColumn(filter.columnId)?.getFilterValue();
      return value && Array.isArray(value) && value.length > 0;
    }
    if (filter.type === 'date') {
      return !!table.getColumn(filter.columnId)?.getFilterValue();
    }
    return false;
  });

  const getFilterValue = (columnId: string) => {
    return tableState?.tableState.filters.find(f => f.id === columnId)?.value;
  };

  const handleResetFilters = () => {
    if (tableState) {
      tableState.setSearchQuery('');

      filters.forEach(filter => {
        tableState.setFilter(filter.columnId, undefined);
      });

      table.resetColumnFilters();
    }
  };
  return (
    <div className={cn('flex flex-col gap-4 px-4', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center"> */}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {searchKey && (
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">{'Search'}</Label>
              <Input
                placeholder={searchPlaceholder || `Search ${searchKey.replace('_', ' ')}...`}
                // value={searchKey ?? (table.getColumn(searchKey)?.getFilterValue() as string)}
                // onChange={event => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                // onChange={event => handleSearch(event.target.value)}
                value={tableState?.tableState.searchQuery}
                onChange={e => tableState?.setSearchQuery(e.target.value)}
                className="h-8 w-[150px] lg:w-[250px]"
              />
            </div>
          )}
          {/* Row - Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter, index) => {
                const value = getFilterValue(filter.columnId);

                switch (filter.type) {
                  case 'select':
                    return (
                      <TableSelectFilter
                        title={filter.title || filter.columnId}
                        value={value}
                        options={filter.options || []}
                        onChange={val => tableState?.setFilter(filter.columnId, val)}
                        placeholder={filter?.placeholder}
                      />
                    );
                  case 'nested-select':
                    return (
                      <TableNestedSelectFilter
                        title={filter.title || filter.columnId}
                        value={value}
                        options={filter.nestedOptions || []}
                        onChange={val => tableState?.setFilter(filter.columnId, val)}
                        placeholder={filter?.placeholder}
                      />
                    );
                  case 'multi-select':
                    return (
                      <TableFacetedFilter
                        key={index}
                        title={filter.title || filter.columnId}
                        options={filter.options || []}
                        value={value as string[] | undefined}
                        onChange={val => tableState?.setFilter(filter.columnId, val)}
                      />
                    );

                  case 'date':
                    return (
                      <TableDateFilter
                        key={filter.columnId}
                        title={filter.title}
                        mode={filter.mode || 'single'}
                        value={value}
                        onValueChange={value => tableState?.setFilter(filter.columnId, value)}
                      />
                    );

                  default:
                    return null;
                }
              })}

              {showClearButton ? (
                <div className="flex flex-col gap-1">
                  <Label className="text-sm font-medium text-gray-700 opacity-0">Reset</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={handleResetFilters}
                    disabled={
                      !tableState?.tableState.searchQuery &&
                      tableState?.tableState.filters.length === 0
                    }
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {actions.length > 0 &&
            actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || 'primary'}
                size="sm"
                className="h-8 w-full sm:w-auto"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          {/* Column Visibility Toggle */}
          {showColumnVisibilityToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-full sm:ml-2 sm:w-auto">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter(column => column.getCanHide())
                  .map(column => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
