import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, DialogPreviewContent } from '@/shared/ui/dialog';

interface ImageDialogProps {
  url: string;
  fileName: string;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}
export const ImageDialog = NiceModal.create<ImageDialogProps>(
  ({ url, fileName, returnFocusRef }) => {
    const modal = useModal();
    return (
      <Dialog open={modal.visible} onOpenChange={(open) => !open && modal.remove()}>
        <DialogPreviewContent
          returnFocusRef={returnFocusRef}
          className="max-h-[80vh] max-w-[80vw] sm:max-w-[80vw]"
          contentClassName="p-0!"
        >
          <div className="flex items-center justify-center overflow-hidden">
            <img src={url} alt={fileName} className="max-h-[80vh] max-w-[80vw] object-contain" />
          </div>
        </DialogPreviewContent>
      </Dialog>
    );
  },
);
