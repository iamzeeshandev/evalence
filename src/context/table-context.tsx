import React, { createContext, useContext } from 'react';
import { useTableState, TableState } from '../hooks/use-table-state';

type TableContextType = ReturnType<typeof useTableState>;

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<
  React.PropsWithChildren<{ initialState?: Partial<TableState> }>
> = ({ children, initialState }) => {
  const tableState = useTableState(initialState);
  return <TableContext.Provider value={tableState}>{children}</TableContext.Provider>;
};

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};
