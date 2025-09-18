import { useState } from 'react';

export type TableFilter = {
  id: string;
  value: any;
};

export type TableState = {
  pageIndex: number;
  pageSize: number;
  searchQuery: string;
  filters: TableFilter[];
};

export const useTableState = (initialState?: Partial<TableState>) => {
  const [tableState, setTableState] = useState<TableState>({
    pageIndex: initialState?.pageIndex || 0,
    pageSize: initialState?.pageSize || 10,
    searchQuery: initialState?.searchQuery || '',
    filters: initialState?.filters || [],
  });

  const setSearchQuery = (searchQuery: string) => {
    setTableState(prev => ({
      ...prev,
      searchQuery,
      pageIndex: 0, // Reset to first page when searching
    }));
  };

  const setFilter = (filterId: string, value: any) => {
    setTableState(prev => {
      const existingFilterIndex = prev.filters.findIndex(f => f.id === filterId);
      let newFilters = [...prev.filters];

      if (value === undefined || value === null || value === '') {
        // Remove filter if value is empty
        newFilters = newFilters.filter(f => f.id !== filterId);
      } else if (existingFilterIndex >= 0) {
        // Update existing filter
        newFilters[existingFilterIndex] = { id: filterId, value };
      } else {
        // Add new filter
        newFilters.push({ id: filterId, value });
      }

      return {
        ...prev,
        filters: newFilters,
        pageIndex: 0, // Reset to first page when filtering
      };
    });
  };

  const setPagination = (pageIndex: number, pageSize: number) => {
    setTableState(prev => ({
      ...prev,
      pageIndex,
      pageSize,
    }));
  };

  return {
    tableState,
    setSearchQuery,
    setFilter,
    setPagination,
  };
};
