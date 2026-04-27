import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

function Switch({
  className,
  defaultChecked = false,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div>
      <SwitchPrimitive.Root
        data-slot="switch"
        checked={checked}
        onCheckedChange={setChecked}
        aria-checked={checked}
        aria-label={checked ? '켜짐' : '꺼짐'}
        title={checked ? '켜짐' : '꺼짐'}
        className={cn(
          'peer data-[state=checked]:bg-primary-400 data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-7.5 w-15 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-6.5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%+4px)] data-[state=unchecked]:translate-x-[2px]',
          )}
        />
      </SwitchPrimitive.Root>
      <span className="sr-only">온오프 스위치</span>
    </div>
  );
}

export { Switch };
