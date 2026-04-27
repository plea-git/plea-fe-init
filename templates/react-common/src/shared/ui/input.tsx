// shared/ui/input/index.tsx

import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/shared/lib/utils';

export const inputVariants = cva(
  [
    'file:text-foreground',
    'placeholder:text-[#bac0c9]',
    'selection:bg-primary selection:text-primary-foreground',
    'border-input',
    'w-full min-w-0 rounded-xl border px-[1.0625rem] text-sm',
    'transition-[color] outline-none',
    'file:inline-flex file:h-7 file:border-0 file:text-sm file:font-medium',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200 disabled:text-[#bac0c9]',
    'focus:read-only:border-gray-200 focus:read-only:drop-shadow-none read-only:border-gray-200 read-only:bg-gray-200 read-only:text-gray-700',
    'focus:border-primary-400 focus:drop-shadow-[0_0_2px_rgba(90,77,235,0.2)]',
  ],
  {
    variants: {
      inputSize: {
        sm: 'h-9 rounded-lg px-[0.6875rem]',
        default: 'h-10.5',
      },
      bg: {
        white: 'bg-white',
        gray: 'bg-gray-100',
      },
      status: {
        default: '',
        error: '!border-error text-error',
      },
    },
    defaultVariants: {
      bg: 'white',
      status: 'default',
      inputSize: 'default',
    },
  },
);

export type InputProps = React.ComponentProps<'input'> & VariantProps<typeof inputVariants>;

export const Input = ({
  className,
  inputSize,
  bg,
  status,
  type = 'text',
  ref,
  ...props
}: InputProps) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        inputVariants({ bg, status, inputSize }),
        type === 'number' && 'no-spinner',
        className,
      )}
      aria-invalid={status === 'error'}
      {...props}
    />
  );
};

Input.displayName = 'Input';
