import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type FilterValue = string | number | boolean | null | undefined;

interface UseCustomSearchParamsOptions<
  TFilter extends Record<string, FilterValue> = Record<string, FilterValue>,
  TSort extends string = string,
> {
  initialFilter?: TFilter;
  defaultLimit?: number;
  defaultSort?: TSort;
  paramKeys?: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}

interface UseCustomSearchParamsReturn<
  TFilter extends Record<string, FilterValue> = Record<string, FilterValue>,
  TSort extends string = string,
> {
  page: number;
  limit: number;
  sort: TSort;
  filter: TFilter;
  params: { page: number; limit: number; sort: TSort } & TFilter;
  localFilter: TFilter;
  setLocalFilter: {
    (key: keyof TFilter, value: FilterValue): void;
    (partial: Partial<TFilter>): void;
  };
  applyFilter: () => void;
  resetFilter: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  reset: () => void;
  onFilterChange: (key: string, value: FilterValue) => void;
  onSortChange: (sort: TSort) => void;
}

/**
 * 쿼리스트링 기반 검색/필터/페이지네이션/정렬 통합 훅 (@tanstack/react-router 버전)
 *
 * localFilter(로컬 상태) → applyFilter(URL 반영) 패턴:
 * 검색 버튼 누르기 전까지는 URL이 바뀌지 않고, 적용 시에만 URL에 반영됩니다.
 *
 * @example
 * const {
 *   params, localFilter, setLocalFilter,
 *   applyFilter, resetFilter, onPageChange, onPageSizeChange, onSortChange,
 * } = useCustomSearchParams({
 *   initialFilter: { keyword: '', status: '' },
 *   defaultLimit: 20,
 *   defaultSort: 'LATEST',
 * });
 */
export function useCustomSearchParams<
  TFilter extends Record<string, FilterValue> = Record<string, FilterValue>,
  TSort extends string = string,
>(
  options: UseCustomSearchParamsOptions<TFilter, TSort> = {},
): UseCustomSearchParamsReturn<TFilter, TSort> {
  const {
    initialFilter = {} as TFilter,
    defaultLimit = 10,
    defaultSort = 'LATEST' as TSort,
    paramKeys = {},
  } = options;

  const pageKey = paramKeys.page ?? 'page';
  const limitKey = paramKeys.limit ?? 'limit';
  const sortKey = paramKeys.sort ?? 'sort';

  const searchParams = useSearch({ from: '__root__' }) as Record<string, unknown>;
  const navigate = useNavigate();
  const [localFilter, setLocalFilter] = useState<TFilter>(initialFilter);
  const localFilterRef = useRef(localFilter);
  const prevFilterRef = useRef<TFilter>(initialFilter);

  useEffect(() => {
    localFilterRef.current = localFilter;
  }, [localFilter]);

  const page = useMemo(() => {
    const parsed = Number(searchParams[pageKey]);
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [searchParams, pageKey]);

  const limit = useMemo(() => {
    const parsed = Number(searchParams[limitKey]);
    return Number.isNaN(parsed) || parsed < 1 ? defaultLimit : parsed;
  }, [searchParams, limitKey, defaultLimit]);

  const sort = useMemo(
    () => (searchParams[sortKey] as TSort) ?? defaultSort,
    [searchParams, sortKey, defaultSort],
  );

  const filter = useMemo(() => {
    const filterFromUrl = { ...initialFilter } as TFilter;

    for (const key of Object.keys(initialFilter)) {
      const urlValue = searchParams[key];
      if (urlValue !== null && urlValue !== undefined) {
        const initialValue = initialFilter[key as keyof TFilter];
        if (typeof initialValue === 'number') {
          const parsed = Number.parseFloat(String(urlValue));
          (filterFromUrl as Record<string, FilterValue>)[key] = Number.isNaN(parsed)
            ? initialValue
            : parsed;
        } else if (typeof initialValue === 'boolean') {
          (filterFromUrl as Record<string, FilterValue>)[key] =
            urlValue === true || urlValue === 'true';
        } else {
          (filterFromUrl as Record<string, FilterValue>)[key] = urlValue as FilterValue;
        }
      }
    }

    return filterFromUrl;
  }, [searchParams, initialFilter]);

  const params = useMemo(() => ({ page, limit, sort, ...filter }), [page, limit, sort, filter]);

  useEffect(() => {
    if (JSON.stringify(prevFilterRef.current) !== JSON.stringify(filter)) {
      prevFilterRef.current = filter;
      setLocalFilter(filter);
    }
  }, [filter]);

  const updateLocalFilter = useCallback(
    (keyOrPartial: keyof TFilter | Partial<TFilter>, value?: FilterValue) => {
      if (typeof keyOrPartial === 'object') {
        setLocalFilter((prev) => ({ ...prev, ...keyOrPartial }));
      } else {
        setLocalFilter((prev) => ({ ...prev, [keyOrPartial]: value }));
      }
    },
    [],
  );

  const navTo = useCallback(
    (newSearch: Record<string, unknown>) => {
      void navigate({ search: newSearch as never, replace: true });
    },
    [navigate],
  );

  const applyFilter = useCallback(() => {
    const newParams: Record<string, unknown> = { ...searchParams, [pageKey]: 1 };

    for (const [key, value] of Object.entries(localFilterRef.current)) {
      if (value === null || value === undefined || value === '') {
        delete newParams[key];
      } else {
        newParams[key] = value;
      }
    }
    newParams._t = String(Date.now());
    navTo(newParams);
  }, [searchParams, pageKey, navTo]);

  const resetFilter = useCallback(() => {
    setLocalFilter(initialFilter);
    const newParams = { ...searchParams, [pageKey]: 1 };
    for (const key of Object.keys(initialFilter)) delete newParams[key];
    delete newParams._t;
    navTo(newParams);
  }, [initialFilter, searchParams, pageKey, navTo]);

  const onPageChange = useCallback(
    (newPage: number) => navTo({ ...searchParams, [pageKey]: newPage }),
    [searchParams, pageKey, navTo],
  );

  const onPageSizeChange = useCallback(
    (newSize: number) => navTo({ ...searchParams, [limitKey]: newSize, [pageKey]: 1 }),
    [searchParams, limitKey, pageKey, navTo],
  );

  const reset = useCallback(() => {
    setLocalFilter(initialFilter);
    const newParams: Record<string, unknown> = {
      ...searchParams,
      [pageKey]: 1,
      [limitKey]: defaultLimit,
      [sortKey]: defaultSort,
    };
    for (const key of Object.keys(initialFilter)) delete newParams[key];
    navTo(newParams);
  }, [initialFilter, searchParams, pageKey, limitKey, sortKey, defaultLimit, defaultSort, navTo]);

  const onSortChange = useCallback(
    (newSort: TSort) => navTo({ ...searchParams, [sortKey]: newSort, [pageKey]: 1 }),
    [searchParams, sortKey, pageKey, navTo],
  );

  const onFilterChange = useCallback((key: string, value: FilterValue) => {
    setLocalFilter((prev) => ({ ...prev, [key]: value === '전체' ? '' : value }));
  }, []);

  return {
    page,
    limit,
    sort,
    filter,
    params,
    localFilter,
    setLocalFilter: updateLocalFilter as UseCustomSearchParamsReturn<TFilter>['setLocalFilter'],
    applyFilter,
    resetFilter,
    onPageChange,
    onPageSizeChange,
    reset,
    onFilterChange,
    onSortChange,
  } as UseCustomSearchParamsReturn<TFilter, TSort>;
}
