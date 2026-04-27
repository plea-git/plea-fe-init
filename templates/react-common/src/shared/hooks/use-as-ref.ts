import * as React from 'react';

import { useIsomorphicLayoutEffect } from '@/shared/hooks/use-isomorphic-layout-effect';

/**
 * 🚀 내가 만든 컴포넌트를 다른 사람이 사용할 때, 그 사람이 useCallback을 안 써도 성능 문제가 없게 하고 싶을 때 사용
 *
 * props로 받은 콜백을 안정적인 참조로 유지하는 훅
 *
 * ## 문제 상황
 * 부모가 useCallback을 안 쓰면 props 콜백이 매 렌더마다 새 함수가 됨
 * → 자식의 useCallback 의존성에 넣으면 자식도 매번 함수를 다시 만듦
 *
 * ```tsx
 * // 부모: useCallback 없이 인라인 함수 전달
 * <Child onChange={(v) => console.log(v)} />
 *
 * // 자식: onChange가 매번 바뀌니까 handleClick도 매번 새로 만들어짐
 * const handleClick = useCallback(() => {
 *   onChange(value)
 * }, [onChange]) // onChange 의존성 필요
 * ```
 *
 * ## 해결
 * ref는 객체 자체가 안 바뀌므로 의존성 배열에 안 넣어도 됨
 * 대신 ref.current가 매 렌더마다 최신 콜백으로 업데이트됨
 *
 * ```tsx
 * const onChangeRef = useAsRef(onChange)
 * const handleClick = useCallback(() => {
 *   onChangeRef.current(value) // 항상 최신 onChange 호출
 * }, []) // 의존성 배열 비워도 안전!
 * ```
 */
function useAsRef<T>(props: T) {
  const ref = React.useRef<T>(props);

  useIsomorphicLayoutEffect(() => {
    ref.current = props;
  });

  return ref;
}

export { useAsRef };
