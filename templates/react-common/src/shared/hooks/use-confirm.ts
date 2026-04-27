import { useCallback } from 'react';
import { useConfirmStore } from '@/shared/stores/confirm-store';

/**
 * 컨펌 다이얼로그를 쉽게 사용하는 훅
 *
 * @example
 * function DeleteButton({ id }: { id: string }) {
 *   const { confirm } = useConfirm();
 *
 *   const handleDelete = async () => {
 *     const ok = await confirm({
 *       title: '삭제 확인',
 *       description: '정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
 *       confirmText: '삭제',
 *       cancelText: '취소',
 *       variant: 'warning',
 *     });
 *
 *     if (ok) {
 *       await deleteItem(id);
 *     }
 *   };
 *
 *   return <button onClick={handleDelete}>삭제</button>;
 * }
 */

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'error' | 'info' | 'success';
}

export function useConfirm() {
  const openConfirm = useConfirmStore((s) => s.openConfirm);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        openConfirm({
          ...options,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
    },
    [openConfirm],
  );

  return { confirm };
}
