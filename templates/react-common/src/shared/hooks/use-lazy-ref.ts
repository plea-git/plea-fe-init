import * as React from 'react';

/**
 * ref의 초기값을 lazy하게 한 번만 계산하는 훅
 *
 * useRef의 초기값은 매 렌더마다 평가되지만, 이 훅은 최초 1회만 실행됨
 * new Map(), new Set() 등 생성 비용이 큰 객체 초기화에 유용
 *
 * @example
 * // 매 렌더마다 new Map() 호출 (비효율)
 * const ref = useRef(new Map())
 *
 * // 최초 1회만 new Map() 호출 (효율적)
 * const ref = useLazyRef(() => new Map())
 */
function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = fn();
  }

  return ref as React.RefObject<T>;
}

export { useLazyRef };
