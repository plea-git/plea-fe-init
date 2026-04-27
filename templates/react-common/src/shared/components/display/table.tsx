import { Inbox } from 'lucide-react';
import React from 'react';
import { Button, type ButtonProps } from '@/shared/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableColGroup,
  TableFooter,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

interface ActionButtonConfig {
  label?: string; // 기본값: '등록'
  onClick?: () => void;
  href?: string;
  buttonProps?: ButtonProps;
}

interface TableAreaProps<T> {
  data: T[];

  colGroup?: React.ReactNode;

  renderHeader: () => React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  showPagination?: boolean;
  showSelect?: boolean;
  showTotalCount?: boolean;
  showActionButton?: boolean;
  scrollable?: boolean;
  maxHeight?: number | string;
  minHeight?: number | string;
  actionButtons?: ActionButtonConfig[];
  children?: React.ReactNode;
  rowSize?: 'sm' | 'md' | 'lg';
  totalUnit?: string;
  emptyMessage?: string;
}

const getColCount = (node: React.ReactNode): number => {
  let count = 0;
  React.Children.forEach(node, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === React.Fragment) {
        count += getColCount(
          (child as React.ReactElement<{ children?: React.ReactNode }>).props.children,
        );
      } else {
        count++;
      }
    }
  });
  return count;
};

export function TableArea<T>({
  data,
  colGroup,
  renderHeader,
  renderRow,
  renderFooter,
  showPagination = true,
  showSelect = true,
  showTotalCount = true,
  actionButtons,
  scrollable = false,
  maxHeight,
  minHeight = '220px',
  children,
  rowSize = 'lg',
  totalUnit = '건',
  emptyMessage = '등록된 데이터가 없습니다.',
}: TableAreaProps<T>) {
  const showTopArea = showTotalCount || (actionButtons && actionButtons.length > 0);
  const showBottomArea = showSelect || showPagination;
  return (
    <div className="flex flex-col gap-4">
      {/* 상단 영역 */}
      {showTopArea && (
        <div className="flex items-end justify-between">
          {showTotalCount ? (
            <div className="flex gap-1 text-sm font-medium">
              총{' '}
              <span className="text-primary-400">
                {data.length.toLocaleString()}
                {totalUnit}
              </span>
            </div>
          ) : (
            <div />
          )}
          {actionButtons && actionButtons.length > 0 ? (
            <div className="flex gap-2">
              {actionButtons.map((button, index) =>
                button.href ? (
                  <Button key={index} size="xs" asChild {...button.buttonProps}>
                    <a href={button.href}>{button.label ?? '등록'}</a>
                  </Button>
                ) : (
                  <Button key={index} size="xs" onClick={button.onClick} {...button.buttonProps}>
                    {button.label ?? '등록'}
                  </Button>
                ),
              )}
            </div>
          ) : (
            <div />
          )}
        </div>
      )}
      {/* 테이블 */}
      <Table scrollable={scrollable} maxHeight={maxHeight} minHeight={minHeight} rowSize={rowSize}>
        {colGroup && <TableColGroup>{colGroup}</TableColGroup>}

        <TableHeader>{renderHeader()}</TableHeader>

        <TableBody>
          {data.length === 0 && (
            <TableRow className="border-0 hover:bg-transparent data-[state=selected]:bg-transparent">
              <TableCell colSpan={getColCount(colGroup) || 1} className="!h-40">
                <div className="flex flex-col items-center justify-center gap-4 text-center text-gray-500">
                  <Inbox size={28} strokeWidth={1.5} />
                  <p>{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data.map((item, index) => renderRow(item, index))}
          {children}
        </TableBody>

        {renderFooter && <TableFooter>{renderFooter()}</TableFooter>}
      </Table>

      {/* 하단 영역 */}
      {showBottomArea && (
        <div className="relative flex items-center justify-between">
          {/* 좌측 Select */}
          {showSelect ? (
            <div className="flex gap-2">
              <Select defaultValue="latest">
                <SelectTrigger className="w-[120px]" bg="white" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="latest">최신등록순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select defaultValue="20">
                <SelectTrigger className="w-[120px]" bg="white" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="10">10개</SelectItem>
                    <SelectItem value="20">20개</SelectItem>
                    <SelectItem value="50">50개</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div />
          )}

          {/* 중앙 Pagination */}
          {showPagination && (
            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationFirst href="#" />
                </PaginationItem>
                <PaginationItem className="mr-2">
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem className="ml-2">
                  <PaginationNext href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLast href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* 우측 여백 (균형용) */}
          {showSelect ? <div className="w-[248px]" /> : <div />}
        </div>
      )}
    </div>
  );
}
