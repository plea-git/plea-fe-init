import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';

/**
 * 쿼리스트링에 상태를 저장/복원하는 훅
 *
 * 검색 조건, 페이지네이션, 정렬 등의 상태를 URL에 유지하여
 * 뒤로가기/새로고침 시 이전 상태를 복원합니다.
 *
 * @example
 * // Route 정의 시 validateSearch로 타입 지정
 * const userListRoute = createRoute({
 *   getParentRoute: () => rootRoute,
 *   path: '/users',
 *   validateSearch: (search: Record<string, unknown>) => ({
 *     page: Number(search.page) || 1,
 *     size: Number(search.size) || 20,
 *     keyword: (search.keyword as string) || '',
 *   }),
 * });
 *
 * // 컴포넌트에서 사용
 * function UserList() {
 *   const { params, setParams, resetParams } = useSearchParamsState({
 *     defaults: { page: 1, size: 20, keyword: '' },
 *   });
 *
 *   const handleSearch = (keyword: string) => setParams({ keyword, page: 1 });
 *   const handleReset = () => resetParams();
 * }
 */

interface UseSearchParamsStateOptions<T extends Record<string, unknown>> {
  defaults: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSearchParamsState<T extends Record<string, unknown>>({
  defaults,
}: UseSearchParamsStateOptions<T>) {
  const search = useSearch({ from: '__root__' }) as Record<string, unknown>;
  const navigate = useNavigate();

  const params = useMemo(() => {
    const merged = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const searchValue = search[key];
      if (searchValue !== undefined && searchValue !== null && searchValue !== '') {
        (merged as Record<string, unknown>)[key] = searchValue;
      }
    }
    return merged;
  }, [defaults, search]);

  const setParams = useCallback(
    (updates: Partial<T>) => {
      void navigate({
        search: { ...search, ...updates } as never,
        replace: true,
      });
    },
    [navigate, search],
  );

  const resetParams = useCallback(() => {
    void navigate({
      search: defaults as never,
      replace: true,
    });
  }, [navigate, defaults]);

  return { params, setParams, resetParams };
}
