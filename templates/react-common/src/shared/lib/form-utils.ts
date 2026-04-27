import type { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

/**
 * 폼 유효성 체크 유틸리티
 *
 * react-hook-form + zod 기반 폼에서 공통으로 사용하는 패턴들입니다.
 */

/**
 * 폼 에러를 토스트로 표시
 *
 * @example
 * <form onSubmit={handleSubmit(onSubmit, showFormErrors)}>
 */
export function showFormErrors<T extends FieldValues>(errors: FieldErrors<T>): void {
  const firstError = Object.values(errors)[0];
  if (firstError?.message && typeof firstError.message === 'string') {
    toast.error(firstError.message);
  }
}

/**
 * 폼이 dirty 상태인지 확인하고 페이지 이탈 시 경고
 *
 * @example
 * useEffect(() => {
 *   const cleanup = warnOnDirtyForm(form);
 *   return cleanup;
 * }, [form.formState.isDirty]);
 */
export function warnOnDirtyForm<T extends FieldValues>(form: UseFormReturn<T>): () => void {
  const handler = (e: BeforeUnloadEvent) => {
    if (form.formState.isDirty) {
      e.preventDefault();
    }
  };

  window.addEventListener('beforeunload', handler);
  return () => window.removeEventListener('beforeunload', handler);
}

/**
 * 첫 번째 에러 필드로 포커스 이동
 *
 * @example
 * const onInvalid = (errors: FieldErrors) => {
 *   focusFirstError(errors);
 *   showFormErrors(errors);
 * };
 */
export function focusFirstError<T extends FieldValues>(errors: FieldErrors<T>): void {
  const firstErrorKey = Object.keys(errors)[0];
  if (firstErrorKey) {
    const el = document.querySelector(`[name="${firstErrorKey}"]`);
    if (el instanceof HTMLElement) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

/**
 * zod 스키마 예시 패턴
 *
 * @example
 * import { z } from 'zod';
 *
 * // 기본 폼 스키마
 * const userSchema = z.object({
 *   name: z.string().min(1, '이름을 입력해주세요').max(50, '50자 이내로 입력해주세요'),
 *   email: z.string().email('이메일 형식이 올바르지 않습니다'),
 *   phone: z.string().regex(/^01[0-9]-\d{4}-\d{4}$/, '휴대폰 번호 형식이 올바르지 않습니다'),
 *   age: z.coerce.number().min(1, '나이를 입력해주세요').max(150, '올바른 나이를 입력해주세요'),
 * });
 *
 * // 날짜 범위 검증 (시작일 <= 종료일)
 * const dateRangeSchema = z.object({
 *   startDate: z.date(),
 *   endDate: z.date(),
 * }).refine(
 *   (data) => data.startDate <= data.endDate,
 *   { message: '시작일이 종료일보다 이후일 수 없습니다', path: ['endDate'] }
 * );
 *
 * // 검색 키워드 최소 2자
 * const searchSchema = z.object({
 *   keyword: z.string().min(2, '검색어는 2자 이상 입력해주세요'),
 * });
 *
 * // 파일 업로드 검증
 * const fileSchema = z.object({
 *   file: z
 *     .instanceof(File)
 *     .refine((f) => f.size <= 5 * 1024 * 1024, '파일 크기는 5MB 이하여야 합니다')
 *     .refine(
 *       (f) => ['image/png', 'image/jpeg'].includes(f.type),
 *       '지원하지 않는 파일 형식입니다 (PNG, JPG만 가능)',
 *     ),
 * });
 */
