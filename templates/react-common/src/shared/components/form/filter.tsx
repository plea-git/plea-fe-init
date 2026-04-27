'use client';

import { RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

export interface FilterItem {
  value: string;
  label: string;
}

interface FilterProps {
  items: FilterItem[];
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  text?: string;
  value?: string[];
  onChange: (value: string[]) => void;
}

export function Filter({
  items,
  className,
  triggerClassName,
  placeholder = '필터',
  text = '필터',
  value = [],
  onChange,
}: FilterProps) {
  const [open, setOpen] = useState(false);

  const [checkedItems, setCheckedItems] = useState<string[]>(value || []);

  const triggerLabel = open ? `${text} 닫기` : `${text} 열기`;

  const reset = () => {
    setCheckedItems([]);
    onChange?.([]);
  };

  const removeItem = (id: string) => {
    const newCheckedItems = checkedItems.filter((item) => item !== id);
    setCheckedItems(newCheckedItems);
    onChange?.(newCheckedItems);
  };

  const apply = () => {
    setOpen(false);
    onChange?.(checkedItems);
  };

  useEffect(() => {
    if (!open) {
      setCheckedItems(value || []);
    }
  }, [open, value]);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn('border-input h-10 min-w-[120px] cursor-pointer rounded-lg border px-3')}
            title={triggerLabel}
          >
            <div className={cn('flex items-center gap-1', triggerClassName)}>
              <div className="flex-1 truncate text-left">
                {value.length > 0 ? text : (placeholder ?? text)}
              </div>
              {value.length > 0 && (
                <span className="text-primary-400 font-medium">{value.length}</span>
              )}
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[460px]">
          <div className="= flex max-h-[310px] w-full flex-col">
            <div className="flex flex-1 flex-wrap gap-2 overflow-y-auto">
              {items.map((item) => (
                <div key={item.value} className="flex w-[calc(25%-6px)] items-center gap-2">
                  <Checkbox
                    id={item.value}
                    checked={checkedItems.includes(item.value)}
                    onCheckedChange={(v) =>
                      setCheckedItems((prev) => {
                        if (v) {
                          return [...prev, item.value];
                        } else {
                          return prev.filter((id) => id !== item.value);
                        }
                      })
                    }
                    className="peer sr-only"
                  />

                  <Label
                    htmlFor={item.value}
                    className="border-input peer-data-[state=checked]:border-primary-400 peer-data-[state=checked]:bg-primary-400 w-full cursor-pointer justify-center rounded-lg border px-2 py-2 text-sm text-gray-900 peer-data-[state=checked]:text-white"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="flex w-full justify-between gap-2 bg-white pt-2">
              <button
                type="button"
                onClick={reset}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-gray-500 hover:text-gray-800"
                title="전체 초기화"
              >
                <RotateCcw size={16} />
              </button>

              <button
                type="button"
                onClick={apply}
                className="bg-primary-400 border-primary-400 flex h-8 w-14 cursor-pointer items-center justify-center rounded-lg border text-sm text-white"
              >
                적용
                {checkedItems.length > 0 && (
                  <span className="ml-1 font-medium text-white/90">{checkedItems.length}</span>
                )}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {items?.map((item) => {
        if (!value?.includes(item.value)) return null;
        return (
          <span
            key={item.value}
            className="bg-primary-50 flex items-center gap-1 rounded-full px-3 py-1 text-sm"
          >
            {item.label}
            <button
              type="button"
              onClick={() => removeItem(item.value)}
              className="cursor-pointer text-gray-400"
              title="삭제"
            >
              <X size={14} />
            </button>
          </span>
        );
      })}

      {value.length > 0 && (
        <button
          type="button"
          onClick={reset}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-gray-500 hover:text-gray-800"
          title="전체 초기화"
        >
          <RotateCcw size={16} />
        </button>
      )}
    </div>
  );
}
