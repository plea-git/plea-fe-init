import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/shared/lib/utils';

export const labelVariants = cva(
  'flex items-center gap-1.5 select-none font-medium leading-none text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-md',
        lg: 'text-lg',
      },
      required: {
        true: 'after:content-["*"] after:text-red-500',
        false: '',
      },
      type: {
        default: 'text-gray-700 ',
        button:
          'cursor-pointer rounded-[0.5625rem] p-[0.5625rem] border border-gray-300 text-gray-500  has-data-[state=checked]:border-primary-400 has-data-[state=checked]:text-primary-400 ',
      },
    },
    defaultVariants: {
      size: 'default',
      required: false,
      type: 'default',
    },
  },
);

function Label({
  className,
  size,
  required,
  htmlFor,
  type,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      htmlFor={htmlFor}
      className={cn(
        'group',
        labelVariants({ size, required, type }),
        htmlFor && type !== 'button' && 'cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
