'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

import 'react-datepicker/dist/react-datepicker.css';
import type { InputProps } from '@/shared/ui/input';

/** 안전하게 날짜 문자열을 Date 객체로 변환하는 헬퍼 */
const parseDateString = (value?: string) => {
  if (!value) return null;
  const cleaned = value.replace(/\./g, '-');
  const date = new Date(cleaned);
  return Number.isNaN(date.getTime()) ? null : date;
};

// -----------------------------
// 년도 선택용 DatePicker
// -----------------------------
export type YearPickerProps = Omit<InputProps, 'onChange'> & {
  defaultValue?: string;
  onChange?: (date: string) => void;
  filterDate?: (data: Date) => boolean;
  showErrorMessage?: boolean;
  errorMessage?: string;
  placeholder?: string;
};

export function YearPicker({
  defaultValue,
  onChange,
  disabled,
  filterDate,
  showErrorMessage,
  errorMessage,
  placeholder,
  ...props
}: YearPickerProps) {
  const [date, setDate] = useState<Date | null>(parseDateString(defaultValue));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(parseDateString(defaultValue));
  }, [defaultValue]);

  const handleChange = (date: Date | null) => {
    if (!date) return;

    setDate(date);
    setOpen(false);
    if (onChange) {
      onChange(format(date, 'yyyy'));
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        if (newOpen && disabled) return;
        setOpen(newOpen);
      }}
    >
      <PopoverTrigger className="w-[140px]">
        <InputGroup inputGroupSize="sm" errorMessage={showErrorMessage ? errorMessage : undefined}>
          <InputGroupInput
            id="year-picker"
            inputSize="sm"
            className="font-normal"
            title="년도 선택"
            placeholder={placeholder}
            value={date && !Number.isNaN(date.getTime()) ? format(date, 'yyyy') : ''}
            disabled={disabled}
            {...props}
          />
          <InputGroupAddon align={'inline-end'}>
            <Calendar className="size-4 text-gray-600" />
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent align="start" className="date w-[250px] p-0">
        <DatePicker
          selected={date}
          showYearPicker
          inline
          locale={ko}
          onChange={handleChange}
          filterDate={filterDate}
        />
      </PopoverContent>
    </Popover>
  );
}

// -----------------------------
// 월만 선택용 DatePicker (YearPicker와 동일 패턴)
// -----------------------------
export type MonthPickerProps = Omit<InputProps, 'onChange'> & {
  defaultValue?: string;
  onChange?: (month: string) => void;
  filterDate?: (date: Date) => boolean;
  showErrorMessage?: boolean;
  errorMessage?: string;
  placeholder?: string;
};

export function MonthPicker({
  defaultValue,
  onChange,
  disabled,
  filterDate,
  showErrorMessage,
  errorMessage,
  placeholder,
  ...props
}: MonthPickerProps) {
  const [date, setDate] = useState<Date | null>(parseDateString(defaultValue));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(parseDateString(defaultValue));
  }, [defaultValue]);

  const handleChange = (date: Date | null) => {
    if (!date) return;

    setDate(date);
    setOpen(false);
    if (onChange) {
      onChange(format(date, 'MM'));
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        if (newOpen && disabled) return;
        setOpen(newOpen);
      }}
    >
      <PopoverTrigger className="h-auto w-[140px]">
        <InputGroup inputGroupSize="sm" errorMessage={showErrorMessage ? errorMessage : undefined}>
          <InputGroupInput
            id="month-picker"
            inputSize="sm"
            className="font-normal"
            title="월 선택"
            placeholder={placeholder}
            value={date && !Number.isNaN(date.getTime()) ? format(date, 'MM', { locale: ko }) : ''}
            disabled={disabled}
            {...props}
          />
          <InputGroupAddon align={'inline-end'}>
            <Calendar className="size-4 text-gray-600" />
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent align="start" className="date w-[250px] p-0">
        <DatePicker
          selected={date}
          showMonthYearPicker
          inline
          locale={ko}
          onChange={handleChange}
          filterDate={filterDate}
        />
      </PopoverContent>
    </Popover>
  );
}

// -----------------------------
// 월+년도 선택용 DatePicker
// -----------------------------

export type MonthYearPickerProps = Omit<InputProps, 'onChange'> & {
  defaultValue?: string;
  onChange?: (date: string) => void;
  filterDate?: (data: Date) => boolean;
  placeholder?: string;
  showErrorMessage?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  formatType?: 'DOT' | 'DASH';
};
export function MonthYearPicker({
  defaultValue,
  onChange,
  filterDate,
  placeholder,
  showErrorMessage,
  errorMessage,
  disabled,
  formatType = 'DASH',
  ...props
}: MonthYearPickerProps) {
  const FORMAT_TYPE = {
    DOT: '.',
    DASH: '-',
  };

  const [date, setDate] = useState<Date | null>(parseDateString(defaultValue));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(parseDateString(defaultValue));
  }, [defaultValue]);

  const handleChange = (date: Date | null) => {
    if (!date) return;

    setDate(date);
    setOpen(false);
    if (onChange) {
      onChange(format(date, `yyyy${FORMAT_TYPE[formatType]}MM`));
    }
  };
  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        if (newOpen && disabled) return;
        setOpen(newOpen);
      }}
    >
      <PopoverTrigger className="h-auto w-[140px]">
        <InputGroup inputGroupSize="sm" errorMessage={showErrorMessage ? errorMessage : undefined}>
          <InputGroupInput
            id="month-year"
            inputSize="sm"
            className="font-normal"
            title="월+년도 선택"
            placeholder={placeholder}
            value={date && !Number.isNaN(date.getTime()) ? format(date, 'yyyy.MM') : ''}
            disabled={disabled}
            {...props}
          />
          <InputGroupAddon align={'inline-end'}>
            <Calendar className="size-4 text-gray-600" />
          </InputGroupAddon>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent align="start" className="date w-[250px] p-0">
        <DatePicker
          selected={date}
          showMonthYearPicker
          onChange={handleChange}
          inline
          locale={ko}
          filterDate={filterDate}
        />
      </PopoverContent>
    </Popover>
  );
}

// -----------------------------
// 월+년도 범위 선택용 DatePicker
// -----------------------------
export type MonthRangePickerProps = MonthYearPickerProps & {
  startDefaultValue?: string;
  endDefaultValue?: string;
  onChangeStart?: (date: string) => void;
  onChangeEnd?: (date: string) => void;
  filterDate?: (data: Date) => boolean;
  placeholder?: string;
  showErrorMessage?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  formatType?: 'DOT' | 'DASH';
};
export function MonthRangePicker({
  startDefaultValue = '',
  endDefaultValue = '',
  onChangeStart,
  onChangeEnd,
  ...props
}: MonthRangePickerProps) {
  return (
    <div className="flex items-center gap-1.5">
      <MonthYearPicker
        {...props}
        defaultValue={startDefaultValue}
        onChange={onChangeStart}
        formatType="DOT"
      />
      <span className="text-sm">~</span>
      <MonthYearPicker
        {...props}
        defaultValue={endDefaultValue}
        onChange={onChangeEnd}
        formatType="DOT"
      />
    </div>
  );
}
