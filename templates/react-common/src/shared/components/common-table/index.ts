import { Actions } from './actions';
import { Filter } from './filter';
import { Root } from './root';
import { Table } from './table';
import { TablePagination } from './table-pagination';

export const CommonTable = {
  Root,
  Filter,
  Actions,
  Table,
  Pagination: TablePagination,
};

export type { ActionButtonConfig, CommonTablePaginationProps, CommonTableProps } from './types';
