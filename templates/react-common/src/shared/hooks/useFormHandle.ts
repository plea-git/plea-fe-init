import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { DefaultValues, FieldValues, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { $ZodType } from 'zod/v4/core';

interface UseFormHandleOptions<TFormValues extends FieldValues, TResponse> {
  /** Zod 스키마 */
  schema: $ZodType<TFormValues, TFormValues>;
  /** 폼 기본값 */
  defaultValues: DefaultValues<TFormValues>;
  /** API 호출 함수 */
  mutationFn: (data: TFormValues) => Promise<TResponse>;
  /** 성공 콜백 */
  onSuccess?: (data: TResponse) => void;
  /** 에러 콜백 */
  onError?: (error: Error) => void;
  /** 성공 메시지 */
  successMessage?: string;
  /** 에러 메시지 */
  errorMessage?: string;
}

interface UseFormHandleReturn<TFormValues extends FieldValues, TResponse> {
  /** react-hook-form 인스턴스 */
  form: UseFormReturn<TFormValues>;
  /** form submit 핸들러 */
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  /** mutation 진행 중 여부 */
  isPending: boolean;
  /** mutation 성공 여부 */
  isSuccess: boolean;
  /** mutation 에러 */
  error: Error | null;
  /** mutation 응답 데이터 */
  data: TResponse | undefined;
  /** 수동 mutation 호출 */
  mutate: (data: TFormValues) => void;
}

/**
 * 폼 상태와 mutation을 통합 관리하는 훅
 *
 * @example
 * ```tsx
 * const { form, onSubmit, isPending } = useFormHandle({
 *   schema: userSchema,
 *   defaultValues: { name: '', email: '' },
 *   mutationFn: userApi.createUser,
 *   onSuccess: () => navigate('/users'),
 * })
 * ```
 */
export function useFormHandle<TFormValues extends FieldValues, TResponse = unknown>({
  schema,
  defaultValues,
  mutationFn,
  onSuccess,
  onError,
  successMessage = '저장되었습니다.',
  errorMessage = '오류가 발생했습니다.',
}: UseFormHandleOptions<TFormValues, TResponse>): UseFormHandleReturn<TFormValues, TResponse> {
  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      if (errorMessage) {
        toast.error(errorMessage, { description: error.message });
      }
      onError?.(error);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    mutate: mutation.mutate,
  };
}
