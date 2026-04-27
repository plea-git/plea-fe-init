import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Textarea } from '@/shared/components/form/textarea';
import type { InputProps } from '@/shared/components/input/base-input';
import { BaseInput } from '@/shared/components/input/base-input';
import { NumberInput, type NumberInputProps } from '@/shared/components/input/number-input';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

function clampCount(length: number, maxLength?: number) {
  if (typeof maxLength !== 'number') return length;
  return Math.min(length, maxLength);
}

type InputGroupProps = React.ComponentProps<'div'> & {
  errorMessage?: string;
  bg?: 'gray' | 'white';
  inputGroupSize?: 'sm' | 'default';
};

function InputGroup({
  className,
  errorMessage,
  bg = 'white',
  inputGroupSize = 'default',
  ...props
}: InputGroupProps) {
  return (
    <div className="w-full">
      <div
        data-slot="input-group"
        role="group"
        data-bg={bg}
        className={cn(
          'group/input-group border-input dark:bg-input/30 relative flex w-full items-center border transition-[color,box-shadow] outline-none',
          'min-w-0 overflow-hidden has-[>textarea]:h-auto',

          // Size variants
          inputGroupSize === 'sm' && 'h-9 rounded-lg',
          inputGroupSize === 'default' && 'h-10.5 rounded-xl',

          // Variants based on alignment.
          'has-data-[align=inline-start]:[&_input]:pl-2',
          'has-data-[align=inline-end]:[&_input]:pr-2',
          'has-data-[align=block-start]:h-auto has-data-[align=block-start]:flex-col has-data-[align=block-start]:[&_input]:pb-3',
          'has-data-[align=block-end]:h-auto has-data-[align=block-end]:flex-col has-data-[align=block-end]:[&_input]:pt-3',

          // Focus state.
          'has-[[data-slot=input-group-control]:focus-visible]:border-primary-400 has-[[data-slot=input-group-control]:focus-visible]:drop-shadow-[0_0_2px_rgba(90,77,235,0.2)]',

          // Error state.
          'has-[[data-slot=input-group-control][aria-invalid=true]]:border-error',
          'has-[[data-slot][aria-invalid=true]]:border-error dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',

          // disabled
          'has-[[data-slot=input-group-control]:disabled]:bg-gray-200',
          'has-[[data-slot=input-group-control]:disabled]:border-gray-200',
          'has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed',

          bg === 'white' && 'bg-white',
          bg === 'gray' && 'bg-gray-100',

          className,
        )}
        {...props}
      />
      {errorMessage && (
        <p className="text-error mt-2.5 text-left text-xs tracking-[-0.6px]">{errorMessage}</p>
      )}
    </div>
  );
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-5 [&>kbd]:rounded-[calc(var(--radius)-5px)] ",
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
        'inline-end': 'order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
        'block-start':
          'order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5',
        'block-end':
          'order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

type InputGroupAddonProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof inputGroupAddonVariants>;

function InputGroupAddon(props: InputGroupAddonProps) {
  const { className, align = 'inline-start', ...restProps } = props;

  const divRef = React.useRef<HTMLDivElement>(null);

  const handleClick = React.useCallback(() => {
    const input = divRef.current?.parentElement?.querySelector<HTMLInputElement>('input, textarea');

    input?.focus();
  }, []);

  return (
    <div
      ref={divRef}
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={handleClick}
      {...restProps}
    />
  );
}

const inputGroupButtonVariants = cva('text-sm shadow-none flex gap-2 items-center', {
  variants: {
    size: {
      xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
      sm: 'h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5',
      'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
      'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
});

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: InputProps) {
  return (
    <BaseInput
      data-slot="input-group-control"
      showErrorMessage={false}
      className={cn(
        'flex-1 rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:drop-shadow focus-visible:drop-shadow-none',
        'bg-transparent group-data-[bg=gray]/input-group:bg-gray-100 group-data-[bg=white]/input-group:bg-white',
        'dark:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

/** 숫자만 입력해야될 때 사용하는 input */
function InputGroupNumberInput({ className, ...props }: NumberInputProps) {
  return (
    <NumberInput
      data-slot="input-group-control"
      showErrorMessage={false}
      className={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:drop-shadow focus-visible:drop-shadow-none dark:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

type InputCountProps = {
  value?: string;
  maxLength?: number;
};

function InputGroupCount({ value = '', maxLength }: InputCountProps) {
  const count = clampCount(value.length, maxLength);

  return (
    <span className="text-muted-foreground text-right text-xs leading-none whitespace-nowrap">
      {count}
      {maxLength ? ` / ${maxLength}자` : null}
    </span>
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupCount,
  InputGroupInput,
  InputGroupNumberInput,
  InputGroupText,
  InputGroupTextarea,
};
