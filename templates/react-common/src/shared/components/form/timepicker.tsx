'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { showConfirmDialog } from '@/shared/components/dialog/confirm-dialog';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

interface TimePickerProps {
  showHour?: boolean;
  showMinute?: boolean;
  limitStartTime?: number;
  limitEndTime?: number;
  onHourChange?: (value: string) => void;
  onMinuteChange?: (value: string) => void;
  hourValue?: string;
  minuteValue?: string;
  placeholder?: string;
  disabled?: boolean;
  beforeTimeCheckable?: boolean;
  settingDate?: Date;
}

export function TimePicker({
  showHour = true,
  showMinute = true,
  limitStartTime = -1,
  limitEndTime = -1,
  onHourChange,
  onMinuteChange,
  hourValue,
  minuteValue,
  placeholder = '--',
  disabled = false,
  beforeTimeCheckable = false,
  settingDate = new Date(),
}: TimePickerProps) {
  const [hour, setHour] = useState<string | null>(hourValue || null);
  const [minute, setMinute] = useState<string | null>(minuteValue || null);

  const [hourOpen, setHourOpen] = useState(false);
  const [minuteOpen, setMinuteOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  useEffect(() => {
    setHour(hourValue || null);
    setMinute(minuteValue || null);
  }, [hourValue, minuteValue]);

  const isBeforeTime = (h: string, m: string) => {
    if (beforeTimeCheckable) return false;

    const nowTime = new Date();

    // 날짜가 같은 날인지 확인
    if (
      settingDate.getFullYear() !== nowTime.getFullYear() ||
      settingDate.getMonth() !== nowTime.getMonth() ||
      settingDate.getDate() !== nowTime.getDate()
    ) {
      return false;
    }

    const nowTotalMinutes = nowTime.getHours() * 60 + nowTime.getMinutes();
    const selectedTotalMinutes = Number(h) * 60 + Number(m);

    return selectedTotalMinutes < nowTotalMinutes;
  };

  return (
    <div className="flex gap-2">
      {showHour && (
        <Popover open={hourOpen} onOpenChange={setHourOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="white"
              className={`focus-visible:border-primary-400 data-[state=open]:border-primary-400 w-20 justify-between focus-visible:shadow-none focus-visible:ring-0 focus-visible:drop-shadow-[0_0_2px_rgba(90,77,235,0.2)] ${hour ? 'text-foreground' : 'text-[#bac0c9]'}`}
              title="시 선택"
              disabled={disabled}
            >
              {hour || placeholder || '00'}
              <ChevronDown className="ml-1 h-4 w-4 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-20 p-1">
            <div className="max-h-40 overflow-auto">
              {hours.map((h) => (
                <button
                  key={h}
                  className={`flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left text-sm hover:bg-gray-100 ${
                    hour === h ? 'bg-primary-50 font-medium' : ''
                  } ${limitStartTime !== -1 && Number(h) >= limitStartTime ? 'text-gray-400' : ''} ${limitEndTime !== -1 && Number(h) <= limitEndTime ? 'text-gray-400' : ''} `}
                  onClick={async () => {
                    if (!beforeTimeCheckable && isBeforeTime(h, minute || '00')) {
                      await showConfirmDialog({
                        description: `현재 시간보다 이전 시간은 선택할 수 없습니다.`,
                        confirmText: '확인',
                        hideCancelButton: true,
                      });
                      return;
                    } else {
                      setHour(h);
                      onHourChange?.(h);
                      setHourOpen(false);
                    }
                  }}
                  disabled={
                    (limitStartTime !== -1 && Number(h) >= limitStartTime) ||
                    (limitEndTime !== -1 && Number(h) <= limitEndTime)
                  }
                >
                  {h}
                  {hour === h && <Check className="h-4 w-4 text-gray-500" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
      {showMinute && (
        <Popover open={minuteOpen} onOpenChange={setMinuteOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="white"
              className={`focus-visible:border-primary-400 data-[state=open]:border-primary-400 w-20 justify-between focus-visible:shadow-none focus-visible:ring-0 focus-visible:drop-shadow-[0_0_2px_rgba(90,77,235,0.2)] ${minute ? 'text-foreground' : 'text-[#bac0c9]'}`}
              title="분 선택"
              disabled={disabled}
            >
              {minute || placeholder || '00'}
              <ChevronDown className="ml-1 h-4 w-4 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-20 p-1">
            <div className="max-h-40 overflow-auto">
              {minutes.map((m) => (
                <button
                  key={m}
                  className={`flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-left text-sm hover:bg-gray-100 ${
                    minute === m ? 'bg-primary-50 font-medium' : ''
                  }`}
                  onClick={async () => {
                    if (!beforeTimeCheckable && isBeforeTime(hour || '00', m)) {
                      await showConfirmDialog({
                        description: `현재 시간보다 이전 시간은 선택할 수 없습니다.`,
                        confirmText: '확인',
                        hideCancelButton: true,
                      });
                      return;
                    } else {
                      setMinute(m);
                      onMinuteChange?.(m);
                      setMinuteOpen(false);
                    }
                  }}
                >
                  {m}
                  {minute === m && <Check className="h-4 w-4 text-gray-500" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
