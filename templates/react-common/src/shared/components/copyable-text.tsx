'use client';

import { Copy } from 'lucide-react';
import { cn, handleCopy } from '@/shared/lib/utils';

interface CopyableTextProps {
  value: string;
  className?: string;
  copyMessage?: string;
}

export function CopyableText({ value, className, copyMessage }: CopyableTextProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="line-clamp-2 break-all" title={value}>
        {value}
      </div>

      <button
        type="button"
        onClick={() => handleCopy(value, copyMessage)}
        className="cursor-pointer"
      >
        <Copy size={16} />
        <span className="sr-only">복사</span>
      </button>
    </div>
  );
}
