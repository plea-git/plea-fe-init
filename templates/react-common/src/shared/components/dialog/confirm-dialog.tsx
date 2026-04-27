import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useEffect } from 'react';
import { useConfirmStore } from '@/shared/stores/confirm-store';
import type { ConfirmIconVariant } from '@/shared/types/icon.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

export interface ConfirmDialogProps {
  description: React.ReactNode;
  subDescription?: React.ReactNode;
  hideCancelButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  icon?: ConfirmIconVariant;
}

export const ConfirmDialog = NiceModal.create<ConfirmDialogProps>(
  ({
    description,
    subDescription,
    hideCancelButton = false,
    confirmText = '예',
    cancelText = '아니오',
    icon = 'info',
  }) => {
    const modal = useModal();
    const openConfirm = useConfirmStore((state) => state.openConfirm);
    const closeConfirm = useConfirmStore((state) => state.closeConfirm);
    void openConfirm;
    void closeConfirm;

    const handleConfirm = () => {
      modal.resolve(true);
      modal.hide();
    };

    const handleCancel = () => {
      modal.resolve(false);
      modal.hide();
    };

    // ESC 키 방지
    const handleEscapeKeyDown = (e: Event) => {
      e.preventDefault();
    };

    // Zustand 스토어에 모달 상태 동기화
    useEffect(() => {
      if (modal.visible) {
        openConfirm({ title: '' });
      } else {
        closeConfirm();
      }
    }, [modal.visible, openConfirm, closeConfirm]);

    return (
      <AlertDialog open={modal.visible} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent icon={icon} onEscapeKeyDown={handleEscapeKeyDown}>
          <AlertDialogHeader>
            <AlertDialogTitle className="whitespace-pre-wrap">{description}</AlertDialogTitle>
            {subDescription && <AlertDialogDescription>{subDescription}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!hideCancelButton && (
              <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
            )}
            <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

/**
 * @example
 * const confirmed = await showConfirmDialog({
 *   title: '삭제 확인',
 *   description: '정말 삭제하시겠습니까?',
 *   confirmText: '삭제',
 * })
 * if (confirmed) {
 *   // 삭제 로직
 * }
 */
export async function showConfirmDialog(props: ConfirmDialogProps): Promise<boolean> {
  const result = await NiceModal.show(ConfirmDialog, props);
  return result === true;
}
