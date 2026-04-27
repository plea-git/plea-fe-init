import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import type { InputProps } from '@/shared/components/input/base-input';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/input-group';

type SearchInputProps = InputProps & {
  onSearch?: () => void;
  inputGroupSize?: 'sm' | 'default';
};

export function SearchInput({
  onSearch,
  ref,
  defaultValue,
  value,
  inputGroupSize = 'sm',
  errorMessage,
  onKeyDown,
  ...props
}: SearchInputProps) {
  // Handle defaultValue by converting to controlled component
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const controlledValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    props.onChange?.(e);
  };

  return (
    <InputGroup inputGroupSize={inputGroupSize} errorMessage={errorMessage as string | undefined}>
      <InputGroupInput
        {...props}
        ref={ref}
        value={controlledValue}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" onClick={onSearch}>
          <SearchIcon className="size-5" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
