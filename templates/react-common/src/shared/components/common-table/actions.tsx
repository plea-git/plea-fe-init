import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import type { CommonTableActionsProps } from './types';

export function Actions({ children, className, buttons }: CommonTableActionsProps) {
  if (children) {
    return <div className={cn('flex items-end justify-between', className)}>{children}</div>;
  }

  if (!buttons || buttons.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-end justify-end', className)}>
      <div className="flex gap-2">
        {buttons.map((button, index) =>
          button.href ? (
            <Button key={index} size="sm" variant={button.variant} asChild>
              <a href={button.href}>{button.label ?? '등록'}</a>
            </Button>
          ) : (
            <Button key={index} size="sm" variant={button.variant} onClick={button.onClick}>
              {button.label ?? '등록'}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}
