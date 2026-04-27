import NiceModal from '@ebay/nice-modal-react';
import { X } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ImageDialog } from '@/shared/components/preview/components/image-modal';
import { isClientFile } from '@/shared/hooks/use-file-upload';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import type { ImagePreviewProps } from './_types';

export const ImagePreview = memo(({ file, onRemove }: ImagePreviewProps) => {
  const [objectUrl, setObjectUrl] = useState<string>('');
  const previewDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isClientFile(file)) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(file.url);
      return undefined;
    }
  }, [file]);

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onRemove(file);
    },
    [file, onRemove],
  );

  const handlePreview = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      await NiceModal.show(ImageDialog, {
        url: objectUrl,
        fileName: file.name,
        returnFocusRef: previewDivRef,
      });
    },
    [file, objectUrl],
  );

  if (!objectUrl) return null;

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div
          className="relative my-2 flex h-30 w-30 cursor-pointer justify-center gap-2 border"
          onClick={handlePreview}
          ref={previewDivRef}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 size-7"
            onClick={handleRemove}
          >
            <X />
            <span className="sr-only">삭제</span>
          </Button>
          <img src={objectUrl} alt={file.name} className="object-contain" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="z-50">
        {file.name}
      </TooltipContent>
    </Tooltip>
  );
});
ImagePreview.displayName = 'ImagePreview';
