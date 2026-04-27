import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ButtonGroup } from '@/shared/ui/button-group';
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from '@/shared/ui/popover';

interface OptionListProps {
  isPopoverDisabled: boolean;
  options: { label: string; action: () => void; disabled?: boolean }[];
  align?: 'start' | 'center' | 'end';
}

export function OptionList({
  isPopoverDisabled = false,
  align = 'start',
  options,
}: Readonly<OptionListProps>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={isPopoverDisabled} className="h-9.5 w-9.5 rounded-md">
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-28 border-0 bg-transparent p-0">
        <PopoverHeader>
          <ButtonGroup orientation="vertical" className="text-[#797D82]">
            {options.map((option) => (
              <Button
                key={option.label}
                variant="outline"
                size="icon-sm"
                className="min-w-28 justify-start rounded-md p-4 text-xs hover:bg-white"
                onClick={option.action}
                disabled={option.disabled}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
