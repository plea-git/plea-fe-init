import type { MonthYearPickerProps } from '@/shared/components/calendar/year-month-pickers';
import { DatePicker } from '@/shared/ui/datepicker';

type DatePickerRangeProps = MonthYearPickerProps & {
  startDate: string;
  endDate: string;
  onChangeStart: (date: string) => void;
  onChangeEnd: (date: string) => void;
};

export function DatePickerRange({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
}: DatePickerRangeProps) {
  const toDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const d = new Date(dateStr.replace(/\./g, '-'));
    return Number.isNaN(d.getTime()) ? undefined : d;
  };

  return (
    <div className="flex items-center gap-1.5">
      <DatePicker
        key={`start-${startDate}`}
        className="w-[140px]"
        defaultDate={toDate(startDate)}
        onChange={onChangeStart}
      />
      <span className="text-sm">~</span>
      <DatePicker
        key={`end-${endDate}`}
        className="w-[140px]"
        defaultDate={toDate(endDate)}
        onChange={onChangeEnd}
      />
    </div>
  );
}

export default DatePickerRange;
