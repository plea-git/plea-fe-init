import type { NiceModalHandler } from '@ebay/nice-modal-react';
import { useCallback, useEffect, useRef } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormStateStore } from '@/shared/stores/form-state-store';
import { showConfirmDialog } from '../components/dialog/confirm-dialog';

interface UseBlockNavigationModalOptions<TFormData extends FieldValues = FieldValues> {
  /**
   * 모달 타입
   */
  type: 'modal';

  /**
   * nice-modal의 useModal() 반환값 (필수)
   */
  modal: NiceModalHandler<TFormData>;

  /**
   * 네비게이션 차단 여부
   * - true: 페이지 이동 시 확인 다이얼로그 표시
   * - false: 페이지 이동 시 자동으로 모달 닫기
   */
  isDirty: boolean;
}

interface UseBlockNavigationPageOptions {
  /**
   * 페이지 타입
   */
  type: 'page';

  /**
   * 네비게이션 차단 여부
   * - true: 페이지 이동 시 확인 다이얼로그 표시
   * - false: 페이지 이동 허용
   */
  isDirty: boolean;

  /**
   * 페이지 cleanup 핸들러 (선택)
   * 페이지 이동 시 실행할 정리 로직
   */
  handler?: () => void;
}

type UseBlockNavigationOptions = UseBlockNavigationModalOptions | UseBlockNavigationPageOptions;

/**
 * 페이지/모달 네비게이션 차단 훅
 *
 * 기능:
 * 1. 페이지 이동 시 변경사항(isDirty)이 있으면 얼럿
 * 2. 모달이 열려있을 때 페이지 이동하면 자동으로 모달 닫기
 * 3. 브라우저 뒤로가기 차단 (isDirty=true일 때)
 *
 * @example
 * // Form 모달에서 사용
 * const modal = useModal()
 * const form = useForm<FormValues>({ ... })
 * useBlockNavigation({
 *   type: 'modal',
 *   modal,
 *   isDirty: form.formState.isDirty
 * })
 *
 * @example
 * // Detail 모달에서 사용 (읽기 전용, 차단 안 함)
 * const modal = useModal()
 * useBlockNavigation({
 *   type: 'modal',
 *   modal,
 *   isDirty: false
 * })
 *
 * @example
 * // 페이지에서 사용
 * const form = useForm<FormValues>({ ... })
 * useBlockNavigation({
 *   type: 'page',
 *   isDirty: form.formState.isDirty,
 *   handler: () => { }
 * })
 */
export function useBlockNavigation(options: UseBlockNavigationOptions) {
  const { type, isDirty } = options;
  const modal = 'modal' in options ? options.modal : undefined;
  const handler = 'handler' in options ? options.handler : undefined;
  const idRef = useRef<string>(`${type}-${Math.random().toString(36).substring(2, 11)}`);

  const { registerItem, unregisterItem, updateItemDirty } = useFormStateStore();

  // 항목 등록/해제
  useEffect(() => {
    if (type === 'modal') {
      if (!modal) {
        console.error('modal is not defined');
        return;
      }

      if (!modal.visible) {
        console.error('modal is not visible');
        return;
      }

      const modalId = idRef.current;
      registerItem(modalId, {
        type,
        isDirty,
        handler: modal,
      });

      return () => {
        unregisterItem(modalId);
      };
    } else if (type === 'page') {
      const pageId = idRef.current;
      registerItem(pageId, {
        type,
        isDirty,
        handler,
      });

      return () => {
        unregisterItem(pageId);
      };
    }
  }, [registerItem, unregisterItem, type, modal, isDirty, handler]);

  // isDirty 상태 업데이트
  useEffect(() => {
    if (type === 'modal') {
      if (!modal?.visible) return;

      const modalId = idRef.current;
      updateItemDirty(modalId, isDirty);
    } else if (type === 'page') {
      const pageId = idRef.current;
      updateItemDirty(pageId, isDirty);
    }
  }, [type, isDirty, modal?.visible, updateItemDirty]);

  //
  const handleConfirmClose = useCallback(
    async (onClose: () => void) => {
      if (isDirty) {
        const confirmed = await showConfirmDialog({
          description: '작성한 내용이 있습니다. \n취소하고 이동하시겠습니까?',
          confirmText: '예',
          cancelText: '아니오',
          icon: 'warning',
        });
        if (confirmed) {
          unregisterItem(idRef.current);
          onClose();
        }
      } else {
        onClose();
      }
    },
    [isDirty, unregisterItem],
  );
  return {
    handleConfirmClose,
  };
}
