import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

/**
 * 목록 페이지 공통 로직 훅
 *
 * 검색, 페이지네이션, 정렬, 체크박스 선택을 한 번에 관리합니다.
 * URL 쿼리스트링과 연동되어 뒤로가기/새로고침 시 상태가 복원됩니다.
 *
 * @example
 * function UserList() {
 *   const list = useListPage({
 *     defaults: { page: 1, size: 20, keyword: '', sort: 'createdAt', order: 'desc' as const },
 *   });
 *
 *   const { data } = useQuery({
 *     queryKey: ['users', list.params],
 *     queryFn: () => api.get('users', { searchParams: list.params }).json(),
 *   });
 *
 *   return (
 *     <>
 *       <SearchBar onSearch={(keyword) => list.search({ keyword })} onReset={list.reset} />
 *       <Table
 *         data={data?.items}
 *         selectedIds={list.selectedIds}
 *         onSelect={list.toggleSelect}
 *         onSelectAll={list.toggleSelectAll}
 *       />
 *       <Pagination
 *         page={list.params.page}
 *         size={list.params.size}
 *         totalCount={data?.totalCount}
 *         onPageChange={(page) => list.setParams({ page })}
 *         onSizeChange={(size) => list.setParams({ size, page: 1 })}
 *       />
 *     </>
 *   );
 * }
 */

interface ListParams {
  page: number;
  size: number;
  [key: string]: unknown;
}

interface UseListPageOptions<T extends ListParams> {
  defaults: T;
}

export function useListPage<T extends ListParams>({ defaults }: UseListPageOptions<T>) {
  const searchParams = useSearch({ from: '__root__' }) as Record<string, unknown>;
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const params = useMemo(() => {
    const merged = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const value = searchParams[key];
      if (value !== undefined && value !== null && value !== '') {
        (merged as Record<string, unknown>)[key] = value;
      }
    }
    return merged;
  }, [defaults, searchParams]);

  const setParams = useCallback(
    (updates: Partial<T>) => {
      setSelectedIds(new Set());
      void navigate({
        search: { ...searchParams, ...updates } as never,
        replace: true,
      });
    },
    [navigate, searchParams],
  );

  const search = useCallback(
    (updates: Partial<T>) => {
      setParams({ ...updates, page: 1 } as Partial<T>);
    },
    [setParams],
  );

  const reset = useCallback(() => {
    setSelectedIds(new Set());
    void navigate({
      search: defaults as never,
      replace: true,
    });
  }, [navigate, defaults]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      return allSelected ? new Set() : new Set(ids);
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  return {
    params,
    setParams,
    search,
    reset,
    selectedIds,
    selectedCount: selectedIds.size,
    hasSelection: selectedIds.size > 0,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  };
}
