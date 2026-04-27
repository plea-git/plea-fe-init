import { cn } from '@/shared/lib/utils';

import type { CommonTableRootProps } from './types';

export function Root({ children, className }: CommonTableRootProps) {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
}
