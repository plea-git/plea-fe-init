import { useNavigate, useRouter } from '@tanstack/react-router';
import { useCallback } from 'react';

const REFERRER_KEY = '__nav_referrer';
const PREVIOUS_URL_KEY = '__nav_previous_url';

interface GoToPathWithQueryOptions {
  /** URL에 표시하지 않고 sessionStorage에 저장할 키 */
  stateKeys?: string[];
  /** true일 경우 현재 URL을 referrer로 저장 (goToPrevious에서 복원) */
  withReferrer?: boolean;
}

interface UseCustomNavigationReturn {
  /** 이전 페이지로 이동. referrer가 있으면 해당 URL로, 없으면 fallback 경로로 이동 */
  goToPrevious: (fallbackPathOrEvent?: string | unknown) => void;
  /** 경로 이동 (previousUrl 저장) */
  goToPath: (path: string) => void;
  /** replace 모드 이동 (히스토리 교체, 뒤로가기 시 이전 페이지 안 보임) */
  goToPathReplace: (path: string) => void;
  /** 쿼리스트링을 포함한 경로로 이동 */
  goToPathWithQuery: (
    path: string,
    params?: Record<string, unknown>,
    options?: GoToPathWithQueryOptions,
  ) => void;
  /** 새 탭으로 경로 이동 (쿼리스트링 포함) */
  openInNewTab: (path: string, params?: Record<string, unknown>) => void;
}

/**
 * 커스텀 페이지 이동 훅 (@tanstack/react-router 버전)
 *
 * TanStack Router에는 react-router의 location.state가 없으므로
 * referrer/previousUrl을 sessionStorage에 저장합니다.
 * - 새로고침해도 유지됨
 * - 탭 닫으면 자동 삭제됨
 *
 * @example
 * const { goToPrevious, goToPath, goToPathReplace, goToPathWithQuery, openInNewTab }
 *   = useCustomNavigation();
 *
 * // 목록 → 상세 (현재 검색 조건 포함 URL을 referrer로 저장)
 * goToPathWithQuery('/users/detail', { userId: '123' }, { withReferrer: true });
 *
 * // 상세 → 뒤로가기 (referrer로 검색 조건 복원, 없으면 /users로)
 * goToPrevious('/users');
 *
 * // 회원가입 단계별 이동 (뒤로가기 시 이전 단계 안 보임)
 * goToPathReplace('/signup/step2');
 */
const useCustomNavigation = (): UseCustomNavigationReturn => {
  const navigate = useNavigate();
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const currentFullUrl = currentPath + router.state.location.searchStr;

  const goToPrevious = useCallback(
    (fallbackPathOrEvent?: string | unknown) => {
      const fallbackPath =
        typeof fallbackPathOrEvent === 'string' ? fallbackPathOrEvent : undefined;

      if (fallbackPath) {
        // referrer가 있으면 해당 URL로 (검색 조건 복원)
        const referrer = sessionStorage.getItem(REFERRER_KEY);
        sessionStorage.removeItem(REFERRER_KEY);

        if (referrer) {
          void navigate({ to: referrer });
        } else {
          void navigate({ to: fallbackPath });
        }
      } else {
        window.history.back();
      }
    },
    [navigate],
  );

  const goToPath = useCallback(
    (path: string) => {
      sessionStorage.setItem(PREVIOUS_URL_KEY, currentPath);
      void navigate({ to: path });
    },
    [navigate, currentPath],
  );

  const goToPathReplace = useCallback(
    (path: string) => {
      void navigate({ to: path, replace: true });
    },
    [navigate],
  );

  const goToPathWithQuery = useCallback(
    (path: string, params?: Record<string, unknown>, options?: GoToPathWithQueryOptions) => {
      const locationOptions: GoToPathWithQueryOptions = Array.isArray(options)
        ? { stateKeys: options }
        : options || {};
      const { stateKeys, withReferrer } = locationOptions;
      const searchParams: Record<string, string> = {};

      if (params) {
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null && value !== '') {
            if (stateKeys?.includes(key)) {
              // stateKeys로 지정된 값은 sessionStorage에 저장
              sessionStorage.setItem(`__nav_state_${key}`, JSON.stringify(value));
            } else {
              searchParams[key] = String(value);
            }
          }
        }
      }

      // withReferrer: 현재 URL(검색 조건 포함)을 저장
      if (withReferrer) {
        sessionStorage.setItem(REFERRER_KEY, currentFullUrl);
      }

      void navigate({ to: path, search: searchParams as never });
    },
    [navigate, currentFullUrl],
  );

  const openInNewTab = useCallback((path: string, params?: Record<string, unknown>) => {
    const urlSearchParams = new URLSearchParams();

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
          urlSearchParams.set(key, String(value));
        }
      }
    }

    const query = urlSearchParams.toString();
    window.open(query ? `${path}?${query}` : path, '_blank');
  }, []);

  return {
    goToPrevious,
    goToPath,
    goToPathReplace,
    goToPathWithQuery,
    openInNewTab,
  };
};

export default useCustomNavigation;
