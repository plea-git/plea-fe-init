import type { ServerFile } from '@/shared/hooks/use-file-upload';

export interface ImagePreviewProps {
  onRemove: (file: File | ServerFile) => void;
  file: File | ServerFile;
}
