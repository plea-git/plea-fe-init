import { create } from 'zustand';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'error' | 'info' | 'success';
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions | null;
  openConfirm: (options: ConfirmOptions) => void;
  closeConfirm: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>()((set, get) => ({
  isOpen: false,
  options: null,

  openConfirm: (options) => set({ isOpen: true, options }),

  closeConfirm: () => set({ isOpen: false, options: null }),

  handleConfirm: () => {
    get().options?.onConfirm?.();
    set({ isOpen: false, options: null });
  },

  handleCancel: () => {
    get().options?.onCancel?.();
    set({ isOpen: false, options: null });
  },
}));
