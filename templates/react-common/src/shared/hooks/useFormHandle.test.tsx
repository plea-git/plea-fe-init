import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { useFormHandle } from './useFormHandle';

// Toast mock
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// 테스트용 스키마
const testSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z.string().email('올바른 이메일을 입력해주세요.'),
});

type TestFormValues = z.infer<typeof testSchema>;

// 테스트용 Wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useFormHandle', () => {
  const defaultValues: TestFormValues = { name: '', email: '' };
  const mockMutationFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('폼이 기본값으로 초기화된다', () => {
    const { result } = renderHook(
      () =>
        useFormHandle<TestFormValues>({
          schema: testSchema,
          defaultValues: { name: '홍길동', email: 'test@example.com' },
          mutationFn: mockMutationFn,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.form.getValues()).toEqual({
      name: '홍길동',
      email: 'test@example.com',
    });
  });

  it('isPending이 초기에 false다', () => {
    const { result } = renderHook(
      () =>
        useFormHandle<TestFormValues>({
          schema: testSchema,
          defaultValues,
          mutationFn: mockMutationFn,
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isPending).toBe(false);
  });

  it('유효한 데이터로 submit하면 mutationFn이 호출된다', async () => {
    mockMutationFn.mockResolvedValue({ id: '1' });

    const { result } = renderHook(
      () =>
        useFormHandle<TestFormValues>({
          schema: testSchema,
          defaultValues,
          mutationFn: mockMutationFn,
        }),
      { wrapper: createWrapper() },
    );

    // 폼 값 설정
    act(() => {
      result.current.form.setValue('name', '홍길동');
      result.current.form.setValue('email', 'test@example.com');
    });

    // Submit
    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockMutationFn).toHaveBeenCalled();
    expect(mockMutationFn.mock.calls[0]?.[0]).toEqual({
      name: '홍길동',
      email: 'test@example.com',
    });
  });

  it('유효하지 않은 데이터는 mutationFn을 호출하지 않는다', async () => {
    const { result } = renderHook(
      () =>
        useFormHandle<TestFormValues>({
          schema: testSchema,
          defaultValues,
          mutationFn: mockMutationFn,
        }),
      { wrapper: createWrapper() },
    );

    // 잘못된 이메일 설정
    act(() => {
      result.current.form.setValue('name', '홍길동');
      result.current.form.setValue('email', 'invalid-email');
    });

    // Submit
    await act(async () => {
      await result.current.onSubmit();
    });

    // 유효성 검사 실패로 mutationFn이 호출되지 않음
    expect(mockMutationFn).not.toHaveBeenCalled();
  });

  it('성공 시 onSuccess 콜백이 호출된다', async () => {
    const mockResponse = { id: '1', name: '홍길동' };
    mockMutationFn.mockResolvedValue(mockResponse);
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () =>
        useFormHandle<TestFormValues>({
          schema: testSchema,
          defaultValues,
          mutationFn: mockMutationFn,
          onSuccess,
        }),
      { wrapper: createWrapper() },
    );

    act(() => {
      result.current.form.setValue('name', '홍길동');
      result.current.form.setValue('email', 'test@example.com');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    });
  });

  it('실패 시 onError 콜백이 호출된다', async () => {
    const mockError = new Error('서버 오류');
    mockMutationFn.mockRejectedValue(mockError);
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useFormHandle<TestFormValues>({
          schema: testSchema,
          defaultValues,
          mutationFn: mockMutationFn,
          onError,
        }),
      { wrapper: createWrapper() },
    );

    act(() => {
      result.current.form.setValue('name', '홍길동');
      result.current.form.setValue('email', 'test@example.com');
    });

    await act(async () => {
      await result.current.onSubmit();
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });
});
