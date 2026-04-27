import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import type { ButtonProps } from '@/shared/ui/button';

export interface CommonTableProps<TData, TSort extends string = string> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  usePagination?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showRowNumber?: boolean;
  rowNumberOrder?: 'asc' | 'desc';
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  enableSorting?: boolean;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  height?: string | number | 'auto';
  emptyMessage?: string | ReactNode;
  className?: string;
  isLoading?: boolean;
  rowSize?: 'sm' | 'md' | 'lg';
  totalUnit?: string;
  showTotalCount?: boolean;
  actionButtons?: ActionButtonConfig[];
  onRowClick?: (row: TData) => void;
  rightText?: string | ReactNode;
  showPageSortOptionSelect?: boolean;
  sort?: TSort;
  onSortChange?: (sort: TSort) => void;
  showSelect?: boolean;
}

export interface ActionButtonConfig {
  label?: string;
  onClick?: () => void;
  href?: string;
  buttonProps?: ButtonProps;
  buttonRef?: React.RefObject<HTMLElement | null>;
  variant?:
    | 'default'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'gray'
    | 'white'
    | 'stress';
}

export interface CommonTableRootProps {
  children: ReactNode;
  className?: string;
}

export interface CommonTableFilterProps {
  children?: ReactNode;
  className?: string;
}

export interface CommonTableActionsProps {
  children?: ReactNode;
  className?: string;
  buttons?: ActionButtonConfig[];
}

export interface CommonTablePaginationProps<TSort extends string = string> {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showSelect?: boolean;
  className?: string;
  showPageSortOptionSelect?: boolean;
  sort?: TSort;
  onSortChange?: (sort: TSort) => void;
}
