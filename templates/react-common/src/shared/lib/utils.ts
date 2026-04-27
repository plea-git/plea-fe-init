import { type ClassValue, clsx } from 'clsx';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';
import { toast } from '@/shared/ui/sonner';

// format.ts에서 re-export (기존 import 호환)
export {
  formatBizNumber,
  formatDate,
  formatPhoneNumber,
  insertComma,
  normalizeRange,
} from './format';

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * clsx로 조건부 클래스를 결합하고, tailwind-merge로 충돌을 해결합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 클립보드 복사 + 토스트 알림
 */
export async function handleCopy(text: string, message = '복사되었습니다.') {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  } catch {
    toast.error('복사에 실패했습니다.');
  }
}

/**
 * select option 생성
 *
 * @example
 * // 배열 → options
 * makeSelectOption(users, 'id', 'name')
 * // [{ value: 1, label: '홍길동' }, ...]
 *
 * // Record → options
 * makeSelectOption({ ACTIVE: '활성', INACTIVE: '비활성' })
 * // [{ value: 'ACTIVE', label: '활성' }, ...]
 *
 * // '전체' 옵션 추가
 * makeSelectOption(users, 'id', 'name', true)
 * // [{ value: '전체', label: '전체' }, { value: 1, label: '홍길동' }, ...]
 */
export function makeSelectOption<T, V extends keyof T, L extends keyof T>(
  data: T[] | undefined | null,
  valueKey: V,
  labelKey: L,
  allOption?: boolean,
): { value: T[V]; label: T[L] }[];
export function makeSelectOption<K extends string, V>(
  data: Record<K, V> | undefined | null,
  allOption?: boolean,
): { value: K | '전체'; label: V | '전체' }[];
export function makeSelectOption(
  data: unknown,
  arg1?: unknown,
  arg2?: unknown,
  arg3?: boolean,
): { value: unknown; label: unknown }[] {
  const allOptionLabel = { value: '전체', label: '전체' };

  if (!data) {
    const isAll = Array.isArray(data) ? arg3 : (arg1 as boolean);
    return isAll ? [allOptionLabel] : [];
  }

  if (Array.isArray(data)) {
    const valueKey = arg1 as string;
    const labelKey = arg2 as string;
    const allOption = arg3;

    const options = (data as Record<string, unknown>[]).map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));

    return allOption ? [allOptionLabel, ...options] : options;
  }

  const allOption = arg1 as boolean;
  const options = Object.entries(data as Record<string, unknown>).map(([value, label]) => ({
    value,
    label,
  }));

  return allOption ? [allOptionLabel, ...options] : options;
}

/**
 * 값이 비었으면 true
 * [], {}, 0, '', null, undefined → true
 */
export function isEmpty(arg: unknown): boolean {
  if (!arg) return true;
  if (typeof arg === 'object') {
    return _.isEmpty(arg);
  }
  return false;
}
