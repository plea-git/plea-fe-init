'use client';

import { format as formatDate, isValid, isWithinInterval, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { CalendarBox } from '@/shared/ui/calendar';
import type { InputProps as BaseInputProps } from '@/shared/ui/input';
import { InputGroup, InputGroupAddon, InputGroupNumberInput } from '@/shared/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

/**
 * DatePicker 컴포넌트의 속성 정의
 * @extends BaseInputProps
 */
export type DatePickerProps = Omit<BaseInputProps, 'onChange'> & {
  /**
   * 입력 그룹의 크기
   * @default 'default'
   */
  inputGroupSize?: 'sm' | 'default';
  mask?: string;

  /**
   * 특정 날짜를 비활성화하기 위한 함수
   * @param data - 체크할 날짜 객체
   * @returns 비활성화 여부 (true일 경우 선택 불가)
   */
  dateDisabled?: (data: Date) => boolean;

  /**
   * 컴포넌트 전체 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  errorMessage?: string;
  showErrorMessage?: boolean;
  status?: string;

  /**
   * 날짜가 변경되었을 때 호출되는 콜백 함수
   * @param date - 선택된 날짜 문자열
   */
  onChange?: (date: string) => void;
  placeholder?: string;

  /**
   * 내부 NumberInput 컴포넌트에 전달될 추가 Props
   */
  numberInputProps?: React.ComponentProps<typeof InputGroupNumberInput>;

  /**
   * 초기 렌더링 시 설정될 기본 날짜
   * @default undefined
   */
  defaultDate?: Date | undefined;
  className?: string;
};
export function DatePicker({
  inputGroupSize = 'sm',
  mask = '_',
  dateDisabled,
  disabled,
  errorMessage,
  showErrorMessage = true,
  status,
  onChange,
  placeholder,
  numberInputProps,
  defaultDate,
  className,
}: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [month, setMonth] = useState<Date>(defaultDate ? defaultDate : new Date());
  const [open, setOpen] = useState(false);
  const [rawNumericValue, setRawNumericValue] = useState(
    defaultDate ? formatDate(defaultDate, 'yyyyMMdd') : '',
  );

  const confirmDate = (value: string) => {
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length === 0) {
      setDate(undefined);
      setRawNumericValue('');
      return true;
    }

    let parsedDate: Date | null = null;

    if (numericValue.length === 8) {
      parsedDate = parse(numericValue, 'yyyyMMdd', new Date());
    } else if (numericValue.length === 6) {
      parsedDate = parse(numericValue, 'yyMMdd', new Date());
    }

    if (
      parsedDate &&
      isValid(parsedDate) &&
      isWithinInterval(parsedDate, { start: new Date(2000, 0, 1), end: new Date(2050, 11, 31) })
    ) {
      setDate(parsedDate);
      setMonth(parsedDate);
      setRawNumericValue(formatDate(parsedDate, 'yyyyMMdd'));

      return true;
    }

    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!open) {
        setOpen(true);
        return;
      }
      const isSuccess = confirmDate(rawNumericValue);
      if (isSuccess) {
        setOpen(false);
      } else {
        e.preventDefault();
      }
    }
  };

  const handleFocus = () => {
    if (disabled) {
      return;
    }
    setOpen(true);
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover
        open={open}
        onOpenChange={(newOpen) => {
          if (newOpen && disabled) return;
          setOpen(newOpen);
        }}
      >
        <PopoverTrigger asChild>
          <div
            className={cn(
              'w-[200px]',
              open &&
                '[&_[data-slot=input-group]]:border-primary-400 [&_[data-slot=input-group]]:drop-shadow-[0_0_2px_rgba(90,77,235,0.2)]',
              className,
            )}
          >
            <InputGroup
              errorMessage={showErrorMessage ? errorMessage : undefined}
              inputGroupSize={inputGroupSize}
            >
              <InputGroupNumberInput
                id="date"
                disabled={disabled}
                format={'####.##.##'}
                mask={mask}
                allowEmptyFormatting={false}
                value={rawNumericValue}
                onValueChange={(values) => {
                  setRawNumericValue(values.value);
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  confirmDate(rawNumericValue);
                }}
                onFocus={handleFocus}
                onClick={handleClick}
                autoComplete="off"
                placeholder={placeholder}
                inputSize={inputGroupSize}
                status={status}
                {...numberInputProps}
              />
              <InputGroupAddon align={'inline-end'}>
                <Calendar className="size-4 text-gray-600" />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <CalendarBox
            mode="single"
            selected={date}
            month={month}
            onMonthChange={setMonth}
            locale={ko}
            disabled={dateDisabled}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
                setMonth(selectedDate);
                setRawNumericValue(formatDate(selectedDate, 'yyyyMMdd'));
                if (onChange) {
                  onChange(formatDate(selectedDate, 'yyyy.MM.dd'));
                }
              } else {
                setDate(undefined);
                setRawNumericValue('');
              }
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={new Date(2020, 0, 1)}
            endMonth={new Date(2050, 11, 31)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
