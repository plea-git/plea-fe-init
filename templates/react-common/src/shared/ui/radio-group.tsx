import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { CircleIcon } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/shared/lib/utils';

const radioItemVariants = cva(
  [
    'group',
    'text-primary aspect-square shrink-0 cursor-pointer rounded-full',
    'border border-[#f0f2f7] border-gray-300',
    'transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
    'data-[state=checked]:border-primary-400',
    'disabled:cursor-not-allowed disabled:bg-gray-100',
  ],
  {
    variants: {
      size: {
        sm: 'size-3.5',
        md: 'size-4.5',
        lg: 'size-5.5',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
);

const radioIndicatorVariants = cva('', {
  variants: {
    size: {
      sm: 'size-1.5',
      md: 'size-2',
      lg: 'size-2.5',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  // React Hook Form의 onChange를 Radix UI의 onValueChange로 매핑
  const { onChange, ...restProps } = props as typeof props & {
    onChange?: (value: string) => void;
  };
  const radioGroupProps = {
    ...restProps,
    onValueChange: onChange || restProps.onValueChange,
  };

  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...radioGroupProps}
    />
  );
}

type RadioGroupItemProps = Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, 'value'> &
  VariantProps<typeof radioItemVariants> & {
    value: string | boolean;
  };

function RadioGroupItem({ className, size, value, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(radioItemVariants({ size }), className)}
      value={String(value)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
        <CircleIcon
          className={cn(
            radioIndicatorVariants({ size }),
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'fill-primary-400 text-primary-400',
            'group-disabled:fill-gray-300 group-disabled:text-gray-300',
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
