import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/shared/lib/utils';

const checkboxVariants = cva(
  [
    'peer dark:bg-input/30 border-gray-300',
    'data-[state=checked]:bg-primary-400 data-[state=checked]:text-primary-foreground',
    'dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary-400',
    'focus-visible:border-ring focus-visible:ring-ring/50',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    'shrink-0 cursor-pointer rounded-[7px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px]',
    'disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-100',
    'data-[state=checked]:disabled:border-gray-200 data-[state=checked]:disabled:bg-gray-200',
  ],
  {
    variants: {
      size: {
        sm: 'size-3 rounded-[3px]',
        md: 'size-4 rounded-[5px]',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

const checkboxIconVariants = cva('', {
  variants: {
    size: {
      sm: 'size-2',
      md: 'size-2.5',
      lg: 'size-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;

function Checkbox({ className, size, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon
          className={cn(
            checkboxIconVariants({ size }),
            'data-[state=checked]:text-white',
            'group-disabled:text-gray-400',
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
