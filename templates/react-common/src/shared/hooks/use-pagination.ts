import { useMemo } from 'react';

/**
 * 페이지네이션 로직 훅
 *
 * @example
 * const { totalPages, pageRange, canPrev, canNext, goTo, goNext, goPrev, goFirst, goLast }
 *   = usePagination({ page: 1, size: 20, totalCount: 235, onPageChange: setPage });
 */

interface UsePaginationOptions {
  page: number;
  size: number;
  totalCount: number;
  /** 한 번에 보여줄 페이지 번호 개수 (기본 10) */
  maxPages?: number;
  onPageChange: (page: number) => void;
}

export function usePagination({
  page,
  size,
  totalCount,
  maxPages = 10,
  onPageChange,
}: UsePaginationOptions) {
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageRange = useMemo(() => {
    const half = Math.floor(maxPages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, maxPages]);

  return {
    totalPages,
    currentPage,
    pageRange,
    canPrev: currentPage > 1,
    canNext: currentPage < totalPages,
    goTo: (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages)),
    goNext: () => onPageChange(Math.min(currentPage + 1, totalPages)),
    goPrev: () => onPageChange(Math.max(currentPage - 1, 1)),
    goFirst: () => onPageChange(1),
    goLast: () => onPageChange(totalPages),
  };
}
