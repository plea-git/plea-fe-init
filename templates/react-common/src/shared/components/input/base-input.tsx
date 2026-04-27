import { XIcon } from 'lucide-react';
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import type { InputProps as BaseInputProps } from '@/shared/ui/input';
import { Input } from '@/shared/ui/input';

// 제한 추가 시 이 객체에만 항목을 넣으면 InputRestriction 타입이 자동 반영됩니다.
const INPUT_RESTRICTIONS = {
  english: (value: string) => value.replace(/[^a-zA-Z\s]/g, ''),
  'english-number': (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, ''),
  'english-number-only': (value: string) => value.replace(/[^a-zA-Z0-9]/g, ''),
  korean: (value: string) => value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, ''),
} satisfies Record<string, (value: string) => string>;

export type InputRestriction = keyof typeof INPUT_RESTRICTIONS;

export type InputProps = BaseInputProps & {
  errorMessage?: React.ReactNode;
  showErrorMessage?: boolean;
  wrapperClassName?: string;
  maxLength?: number;
  restriction?: InputRestriction;
};

export function BaseInput({
  className,
  status,
  errorMessage,
  onChange,
  showErrorMessage = true,
  wrapperClassName,
  maxLength = 50,
  value,
  ref,
  restriction,
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!);
  const isComposingRef = useRef(false);
  const availableRef = useRef<number | null>(null);
  const prevValueRef = useRef<string>('');
  const prevSelectionRef = useRef<number | null>(null);

  const [hasValue, setHasValue] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  const showClear = hasValue && isFocused && !props.disabled;
  const rightPadding = showClear ? 'pr-10!' : '';

  const currentValue = value !== undefined ? value : internalValue;
  const currentStr = String(currentValue ?? '');

  const applyRestriction = (value: string, restriction?: InputRestriction) => {
    if (!restriction) return value;
    return INPUT_RESTRICTIONS[restriction](value);
  };

  useEffect(() => {
    prevValueRef.current = currentStr;
  }, [currentStr]);

  const getLen = (value: string) => Array.from(value).length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const next = restriction ? applyRestriction(raw, restriction) : raw;

    setHasValue(next.length > 0);

    if (getLen(next) <= maxLength) {
      if (value === undefined) {
        setInternalValue(next);
      }
      if (next !== raw) {
        e.target.value = next;
      }
      onChange?.(e);
      return;
    }

    // 초과 → 이전 값으로 복구
    updateValue(prevValueRef.current);

    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      const pos = prevSelectionRef.current ?? prevValueRef.current.length;
      input.setSelectionRange(pos, pos);
    });
  };

  const handleClear = () => {
    if (!inputRef.current) return;
    inputRef.current.value = '';
    onChange?.({
      target: inputRef.current,
    } as React.ChangeEvent<HTMLInputElement>);
    setHasValue(false);
    setInternalValue('');
  };

  const updateValue = useCallback(
    (next: string) => {
      if (value === undefined) {
        setInternalValue(next);
      }
      if (onChange) {
        onChange({ target: { value: next } } as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [value, onChange],
  );

  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref != null && typeof ref === 'object' && 'current' in ref) {
        (ref as { current: HTMLInputElement | null }).current = el;
      }
    },
    [ref],
  );

  return (
    <div className={cn('w-full flex-1', wrapperClassName)}>
      <div className="relative">
        <Input
          ref={setRef}
          value={currentStr}
          className={cn('text-ellipsis whitespace-nowrap', rightPadding, className)}
          status={status}
          onCompositionStart={(e: React.CompositionEvent<HTMLInputElement>) => {
            isComposingRef.current = true;
            const input = e.currentTarget;
            const start = input.selectionStart ?? currentStr.length;
            const end = input.selectionEnd ?? currentStr.length;
            const beforeLen = Array.from(currentStr.slice(0, start)).length;
            const afterLen = Array.from(currentStr.slice(end)).length;
            availableRef.current = maxLength - beforeLen - afterLen;
          }}
          onCompositionEnd={(e: React.CompositionEvent<HTMLInputElement>) => {
            isComposingRef.current = false;
            availableRef.current = null;

            let value = applyRestriction(e.currentTarget.value, restriction);

            if (getLen(value) > maxLength) {
              value = Array.from(value).slice(0, maxLength).join('');
            }

            updateValue(value);

            requestAnimationFrame(() => {
              const input = inputRef.current;
              if (!input) return;
              input.focus();
              const pos = input.selectionStart ?? input.value.length;
              input.setSelectionRange(pos, pos);
            });
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            prevValueRef.current = currentStr;
            prevSelectionRef.current = e.currentTarget.selectionStart;
            props.onKeyDown?.(e);
          }}
          onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const paste = e.clipboardData.getData('text');
            if (!paste) return;
            const input = e.currentTarget;
            const start = input.selectionStart ?? currentStr.length;
            const end = input.selectionEnd ?? currentStr.length;
            const before = Array.from(currentStr.slice(0, start));
            const after = Array.from(currentStr.slice(end));
            const available = maxLength - before.length - after.length;
            if (available <= 0) return;

            const insertRaw = Array.from(paste).slice(0, available).join('');
            const insert = applyRestriction(insertRaw, restriction);

            const nextValue = before.join('') + insert + after.join('');
            updateValue(nextValue);

            const nextCursor = before.length + Array.from(insert).length;
            requestAnimationFrame(() => {
              input.setSelectionRange(nextCursor, nextCursor);
            });
            props.onPaste?.(e);
          }}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showClear && (
          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 group-has-data-[align=inline-end]/input-group:right-1!">
            {showClear && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-700 text-white"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {showErrorMessage && status === 'error' && errorMessage && (
        <p className="text-error mt-2.5 text-xs">{errorMessage}</p>
      )}
    </div>
  );
}
