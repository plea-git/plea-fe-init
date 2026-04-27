import { cn } from '@/shared/lib/utils';

import type { CommonTableFilterProps } from './types';

export function Filter({ children, className }: CommonTableFilterProps) {
  return (
    <div
      className={cn(
        'flex items-end justify-between gap-4 rounded-2xl bg-[#f8fafc] px-5 py-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
