import { useId, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Label } from '@/shared/ui/label';
import {
  RadioGroup as UIRadioGroup,
  RadioGroupItem as UIRadioGroupItem,
} from '@/shared/ui/radio-group';

interface RadioGroupProps {
  groupClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  onValueChange?: (value: string) => void;
  groupDisabled?: boolean;
  variant?: 'default' | 'outline';
  defaultValue?: string;
  groupReadonly?: boolean;
}

export function RadioGroup({
  groupClassName,
  itemClassName,
  labelClassName,
  options,
  onValueChange,
  groupDisabled = false,
  groupReadonly = false,
  variant = 'default',
  defaultValue,
}: Readonly<RadioGroupProps>) {
  // ..
  const baseId = useId();
  const initialValue = defaultValue ?? options?.[0]?.value;
  const [selectedValue, setSelectedValue] = useState(initialValue);
  return (
    <UIRadioGroup
      defaultValue={initialValue}
      className={cn(
        'grid w-fit grid-flow-col gap-2.5',
        variant === 'default' && 'gap-[30px]',
        groupClassName,
      )}
      disabled={groupDisabled || groupReadonly}
      value={selectedValue}
      onValueChange={(value) => {
        setSelectedValue(value);
        onValueChange?.(value);
      }}
    >
      {options.map((option) => (
        <div
          className={cn(
            'flex items-center gap-3',
            variant === 'outline' && 'min-w-[227px] rounded-lg border border-[#F0F2F7] p-2.5',
            variant === 'outline' && selectedValue === option.value && 'bg-[#F8FAFC]',
            groupReadonly && '*:data-[state=checked]:border-[#F0F2F7]',
          )}
          key={option.value}
        >
          <UIRadioGroupItem
            value={option.value}
            id={`${baseId}-${option.value}`}
            disabled={option.disabled}
            className={cn(itemClassName)}
          />
          <Label htmlFor={`${baseId}-${option.value}`} className={labelClassName}>
            {option.label}
          </Label>
        </div>
      ))}
    </UIRadioGroup>
  );
}
