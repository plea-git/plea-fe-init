import type { NiceModalHandler } from '@ebay/nice-modal-react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PageFormState {
  id: string;
  type: 'page';
  isDirty?: boolean;

  handler?: () => void;
}

interface ModalFormState {
  id: string;
  type: 'modal';
  isDirty?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: NiceModalHandler<any>;
}

type FormState = PageFormState | ModalFormState;

interface DialogState {
  items: FormState[];

  registerItem: (id: string, state: Omit<FormState, 'id'>) => void;
  unregisterItem: (id: string) => void;
  updateItemDirty: (id: string, isDirty: boolean) => void;

  hasBlockingItem: () => boolean;
}

/**
 * 다이얼로그 전역 상태 관리
 *
 * 1. 컨펌 다이얼로그가 열려있을 때 브라우저의 뒤로가기/앞으로가기를 방지하기 위해 사용
 * 2. 모달 상태 관리 (isDirty 추적, 페이지 이동 시 처리)
 */
export const useFormStateStore = create<DialogState>()(
  immer((set, get) => ({
    items: [],

    registerItem: (id, state) => {
      set((draft) => {
        // 동일 ID가 이미 존재하면 제거 (Hot Reload 시 중복 방지)
        draft.items = draft.items.filter((item) => item.id !== id);
        draft.items.push({ id, ...state } as FormState);
      });
    },

    unregisterItem: (id) => {
      set((draft) => {
        draft.items = draft.items.filter((m) => m.id !== id);
      });
    },

    updateItemDirty: (id, isDirty) => {
      set((draft) => {
        const item = draft.items.find((m) => m.id === id);
        if (item) item.isDirty = isDirty;
      });
    },

    hasBlockingItem: () => get().items.some((m) => m.isDirty ?? false),
  })),
);
