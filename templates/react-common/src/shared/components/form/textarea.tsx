import { cva, type VariantProps } from 'class-variance-authority';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/lib/utils';

const textareaVariants = cva(
  [
    'placeholder:text-[#bac0c9]',
    'border-input',
    'w-full resize-none rounded-xl border px-[1.0625rem] py-3 text-sm',
    'transition-[color] outline-none',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-[#bac0c9]',
    'focus:border-primary-400 focus:drop-shadow-[0_0_2px_rgba(90,77,235,0.2)]',
    'min-h-24',
  ],
  {
    variants: {
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
    },
  },
);

export type TextareaProps = React.ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants> & {
    errorMessage?: React.ReactNode;
    showErrorMessage?: boolean;
    wrapperClassName?: string;
    showCount?: boolean;
    addCount?: number;
    maxLength?: number;
  };

function clampCount(length: number, addCount: number, maxLength?: number) {
  if (typeof maxLength !== 'number') return length;
  return Math.min(length, maxLength - addCount);
}

function Textarea({
  className,
  bg,
  status,
  errorMessage,
  showErrorMessage = true,
  showCount = false,
  //글자수 카운팅 보정값
  addCount = 0,
  wrapperClassName,
  onChange,
  value,
  defaultValue,
  maxLength,
  ...props
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);
  const prevValueRef = useRef<string>('');
  const prevSelectionRef = useRef<number | null>(null);

  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [count, setCount] = useState(() =>
    clampCount(
      value?.toString().length ?? defaultValue?.toString().length ?? 0,
      addCount,
      maxLength,
    ),
  );

  const currentValue = value !== undefined ? value : internalValue;
  const currentStr = String(currentValue ?? '');

  useEffect(() => {
    prevValueRef.current = currentStr;
  }, [currentStr]);

  useEffect(() => {
    if (value !== undefined) {
      setCount(clampCount(value.toString().length, addCount, maxLength));
    }
  }, [value, addCount, maxLength]);

  const getLen = (value: string) => Array.from(value).length;

  const updateValue = useCallback(
    (next: string) => {
      if (value === undefined) {
        setInternalValue(next);
      }
      if (onChange) {
        onChange({ target: { value: next } } as React.ChangeEvent<HTMLTextAreaElement>);
      }
      setCount(clampCount(next.length, addCount, maxLength));
    },
    [value, onChange, addCount, maxLength],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;

    if (!maxLength) {
      if (value === undefined) {
        setInternalValue(raw);
      }
      onChange?.(e);
      setCount(raw.length);
      return;
    }

    if (getLen(raw) <= maxLength) {
      if (value === undefined) {
        setInternalValue(raw);
      }
      onChange?.(e);
      setCount(clampCount(raw.length, maxLength));
      return;
    }

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.value = prevValueRef.current;
      requestAnimationFrame(() => {
        const pos = prevSelectionRef.current ?? prevValueRef.current.length;
        textarea.setSelectionRange(pos, pos);
      });
    }
  };

  const showCounter = showCount && typeof maxLength === 'number';

  return (
    <div className={cn('w-full', wrapperClassName)}>
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(textareaVariants({ bg, status }), className)}
        aria-invalid={status === 'error'}
        value={currentStr}
        defaultValue={defaultValue}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          isComposingRef.current = false;

          if (!maxLength) {
            updateValue(e.currentTarget.value);
            return;
          }

          let value = e.currentTarget.value;

          if (getLen(value) > maxLength) {
            value = Array.from(value).slice(0, maxLength).join('');
          }

          updateValue(value);

          requestAnimationFrame(() => {
            const textarea = textareaRef.current;
            if (!textarea) return;
            textarea.focus();
            const pos = textarea.selectionStart ?? textarea.value.length;
            textarea.setSelectionRange(pos, pos);
          });
        }}
        onKeyDown={(e) => {
          prevValueRef.current = currentStr;
          prevSelectionRef.current = e.currentTarget.selectionStart;
          props.onKeyDown?.(e);
        }}
        onPaste={(e) => {
          if (!maxLength) return;

          e.preventDefault();
          const paste = e.clipboardData.getData('text');
          if (!paste) return;

          const textarea = e.currentTarget;
          const start = textarea.selectionStart ?? currentStr.length;
          const end = textarea.selectionEnd ?? currentStr.length;
          const before = Array.from(currentStr.slice(0, start));
          const after = Array.from(currentStr.slice(end));
          const available = maxLength - before.length - after.length;
          if (available <= 0) return;

          const insert = Array.from(paste).slice(0, available).join('');

          const nextValue = before.join('') + insert + after.join('');
          updateValue(nextValue);

          const nextCursor = before.length + Array.from(insert).length;
          requestAnimationFrame(() => {
            textarea.setSelectionRange(nextCursor, nextCursor);
          });
          props.onPaste?.(e);
        }}
        onChange={handleChange}
        {...props}
      />
      <div className="mt-1 flex items-center justify-between p-0">
        {showErrorMessage && status === 'error' && errorMessage ? (
          <p className="text-error text-xs leading-none tracking-[-0.6px]">{errorMessage}</p>
        ) : (
          <div />
        )}
        {showCounter && (
          <div className="text-muted-foreground text-right text-xs leading-none">
            {count + addCount} / {maxLength}자
          </div>
        )}
      </div>
    </div>
  );
}

export { Textarea, textareaVariants };
