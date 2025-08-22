export interface GFilterPagination {
  currentPage?: number;
  limit?: number;
  pageSize?: number;
  searchText?: string;
  orderBy?: string;
  sortBy?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  from?: string;
  to?: string;
  statusIds?: number;
  hospitalId?: number;
  offset?: number;
  doctorIds?: string;
}

export interface GPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}
