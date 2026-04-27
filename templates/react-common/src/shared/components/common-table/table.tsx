import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';
import { cn, insertComma } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  TableBody,
  TableCell,
  TableCol,
  TableColGroup,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable,
} from '@/shared/ui/table';
import { TablePagination } from './table-pagination';
import type { CommonTableProps } from './types';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function Table<TData, TSort extends string = string>({
  data,
  columns: userColumns,
  usePagination = true,
  totalCount,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showRowNumber = true,
  rowNumberOrder = 'asc',
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  enableSorting = true,
  sorting,
  onSortingChange,
  height,
  emptyMessage = '데이터가 없습니다',
  className,
  isLoading = false,
  rowSize = 'lg',
  totalUnit = '건',
  showTotalCount = true,
  actionButtons,
  onRowClick,
  rightText,
  showPageSortOptionSelect = true,
  sort,
  onSortChange,
  showSelect = true,
}: CommonTableProps<TData, TSort>) {
  const actualTotalCount = totalCount ?? data.length;

  const columns = useMemo(() => {
    const cols: ColumnDef<TData, unknown>[] = [];

    if (enableRowSelection) {
      cols.push({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="모두 선택"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="행 선택"
          />
        ),
        enableSorting: false,
        size: 60,
      });
    }

    if (showRowNumber) {
      cols.push({
        id: 'rowNumber',
        header: 'NO',
        cell: ({ row }) => {
          if (rowNumberOrder === 'desc') {
            return actualTotalCount - ((currentPage - 1) * pageSize + row.index);
          }
          return (currentPage - 1) * pageSize + row.index + 1;
        },
        enableSorting: false,
        size: 60,
      });
    }

    return [...cols, ...userColumns];
  }, [
    userColumns,
    enableRowSelection,
    showRowNumber,
    rowNumberOrder,
    actualTotalCount,
    currentPage,
    pageSize,
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting,
    manualPagination: true,
    pageCount: Math.ceil(actualTotalCount / pageSize),
    state: {
      sorting: sorting ?? [],
      rowSelection: rowSelection ?? {},
    },
    onSortingChange: (updater) => {
      if (onSortingChange) {
        const newSorting = typeof updater === 'function' ? updater(sorting ?? []) : updater;
        onSortingChange(newSorting);
      }
    },
    onRowSelectionChange: (updater) => {
      if (onRowSelectionChange) {
        const newSelection = typeof updater === 'function' ? updater(rowSelection ?? {}) : updater;
        onRowSelectionChange(newSelection);
      }
    },
    enableRowSelection,
  });

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    }
  };

  const renderSortIcon = (column: ReturnType<typeof table.getAllColumns>[number]) => {
    if (!column.getCanSort()) return null;

    const sorted = column.getIsSorted();
    if (sorted === 'asc') return <ArrowUp className="ml-1 inline-block size-4" />;
    if (sorted === 'desc') return <ArrowDown className="ml-1 inline-block size-4" />;
    return <ArrowUpDown className="ml-1 inline-block size-4 opacity-50" />;
  };

  const scrollableStyle = useMemo(() => {
    if (height === 'auto' || height === undefined) return undefined;
    return {
      maxHeight: typeof height === 'number' ? `${height}px` : height,
    };
  }, [height]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {showTotalCount && (
          <div className="flex items-end justify-between">
            <Skeleton className="h-5 w-24" />
          </div>
        )}
        <UITable
          rowSize={rowSize}
          scrollable={!!scrollableStyle}
          maxHeight={scrollableStyle?.maxHeight}
        >
          <TableColGroup>
            {columns.map((col, idx) => (
              <TableCol
                key={`col-${col.id || idx}`}
                style={{ width: col.size ? `${col.size}px` : undefined }}
              />
            ))}
          </TableColGroup>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={`head-${col.id || idx}`}>
                  <Skeleton className="mx-auto h-4 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: pageSize }).map((_, rowIdx) => (
              <TableRow key={`row-${rowIdx}`}>
                {columns.map((col, colIdx) => (
                  <TableCell key={`cell-${rowIdx}-${col.id || colIdx}`}>
                    <Skeleton className="mx-auto h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </UITable>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-end justify-between">
        {showTotalCount && (
          <div className="flex gap-1 text-sm font-medium">
            총{' '}
            <span className="text-primary-400">
              {insertComma(actualTotalCount)}
              {totalUnit}
            </span>
          </div>
        )}
        {(rightText || (actionButtons && actionButtons.length > 0)) && (
          <div className="flex gap-2">
            {rightText && <p>{rightText}</p>}
            {actionButtons &&
              actionButtons.length > 0 &&
              actionButtons.map((button) => (
                <Button
                  key={button.label}
                  ref={button.buttonRef as React.RefObject<HTMLButtonElement>}
                  size="xs"
                  onClick={button.onClick}
                  asChild={!!button.href}
                  {...button.buttonProps}
                >
                  {button.href ? (
                    <a href={button.href}>{button.label ?? ''}</a>
                  ) : (
                    (button.label ?? '')
                  )}
                </Button>
              ))}
          </div>
        )}
      </div>

      <UITable
        rowSize={rowSize}
        scrollable={!!scrollableStyle}
        maxHeight={scrollableStyle?.maxHeight}
      >
        <TableColGroup>
          {table.getAllColumns().map((col) => (
            <TableCol
              key={col.id}
              style={{
                width: col.getSize() !== 150 ? `${col.getSize()}px` : undefined,
              }}
            />
          ))}
        </TableColGroup>

        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | { headerClassName?: string }
                  | undefined;
                return (
                  <TableHead
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={cn(
                      header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                      meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {enableSorting && renderSortIcon(header.column)}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => onRowClick?.(row.original)}
                className={onRowClick ? 'cursor-pointer' : ''}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as { cellClassName?: string } | undefined;
                  return (
                    <TableCell key={cell.id} className={meta?.cellClassName}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </UITable>

      {usePagination && (
        <TablePagination<TSort>
          totalCount={actualTotalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
          showPageSortOptionSelect={showPageSortOptionSelect}
          sort={sort}
          onSortChange={onSortChange}
          showSelect={showSelect}
        />
      )}
    </div>
  );
}
