import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const buttonBase = cn(
  'inline-flex shrink-0 items-center justify-center gap-3',
  'whitespace-nowrap text-sm font-medium leading-none',
  'rounded-xl',
  'cursor-pointer transition-all',
  'disabled:pointer-events-none disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  'outline-none',
  'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  'focus:border-ring focus:outline-none focus:ring-[3px] focus:ring-ring/50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
);

const buttonVariants = cva(buttonBase, {
  variants: {
    variant: {
      default: 'bg-primary-400 text-primary-foreground hover:bg-primary-300',
      destructive:
        'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
      outline:
        'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: '',
      link: 'text-primary underline-offset-4 hover:underline',
      gray: 'bg-gray-200 text-gray-500 hover:bg-gray-100',
      white: 'bg-white hover:bg-white border-input border',
      stress: 'bg-primary-300 text-primary-foreground hover:bg-primary-200',
    },
    size: {
      default:
        'h-10.5 px-7 has-[>svg]:px-3 has-[>svg:last-child:not(:only-child)]:pr-4.5 has-[>svg:first-child:not(:only-child)]:pl-4.5 has-[>svg:only-child]:px-4',
      xs: 'h-7 rounded-md gap-1.5 px-2.5 has-[>svg]:px-[0.3125rem]',
      sm: 'h-9 rounded-lg gap-1.5 px-5 has-[>svg]:px-[0.5625rem]',
      lg: 'h-12.5 rounded-xl px-8 has-[>svg]:px-4',
      icon: 'size-10.5 rounded-lg ',
      'icon-xs': 'size-7  rounded-md',
      'icon-sm': 'size-9  rounded-xl',
      'icon-lg': 'size-12.5 rounded-xl px-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        type={type}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
