import * as React from 'react';

/**
 * SSR 환경에서는 useEffect, 브라우저에서는 useLayoutEffect를 사용
 *
 * useLayoutEffect는 서버에서 실행 시 경고가 발생하므로,
 * SSR 프레임워크(Next.js 등)에서 안전하게 사용하기 위한 훅
 *
 * @note 이 프로젝트는 Vite SPA이므로 useLayoutEffect를 직접 사용해도 무방
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export { useIsomorphicLayoutEffect };
