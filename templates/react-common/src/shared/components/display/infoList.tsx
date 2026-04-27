import { cva } from 'class-variance-authority';
import { type InfoListProps, infoListVariants } from '@/shared/components/display/_types';
import { GeneralTooltip } from '@/shared/components/tooltip/general-tooltip';
import { cn } from '@/shared/lib/utils';

const infoItemVariants = cva('flex', {
  variants: {
    columns: {
      4: 'flex-[0_0_calc(25%-0.9375rem)]',
      3: 'flex-[0_0_calc(33.33%-0.8331rem)]',
      2: 'flex-[0_0_calc(50%-0.625rem)]',
      1: 'w-full',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
    },

    full: {
      true: 'flex-[0_0_100%]',
      false: '',
    },
  },
  defaultVariants: {
    columns: 2,
    align: 'start',
    full: false,
  },
});

function InfoList({
  items,
  columns = 2,
  labelWidth = 140,
  className,
  isDot = false,
}: InfoListProps) {
  return (
    <ul data-slot="info-list" className={cn(infoListVariants({ columns }), className)}>
      {items.map((item) => {
        const showDot = item.isDot ?? isDot;

        return (
          <li
            key={`${item.label}`}
            data-slot="info-item"
            className={cn(
              infoItemVariants({
                columns,
                align: item.align ?? 'start',
                full: columns === 2 && item.full,
              }),
            )}
          >
            <p
              className={cn(
                'flex shrink-0 items-center gap-2',
                showDot &&
                  "before:size-1 before:rounded-full before:bg-gray-400 before:content-['']",
              )}
              style={{ minWidth: labelWidth }}
            >
              {item.tooltipLocation === 'label' && item.tooltipContents ? (
                <GeneralTooltip content={item.tooltipContents}>
                  <span className="cursor-pointer underline underline-offset-4">{item.label}</span>
                </GeneralTooltip>
              ) : (
                item.label
              )}
            </p>
            <div className="flex-1">
              {item.tooltipLocation === 'value' && item.tooltipContents ? (
                <GeneralTooltip content={item.tooltipContents}>
                  <span className="cursor-pointer underline underline-offset-4">{item.value}</span>
                </GeneralTooltip>
              ) : (
                item.value || '-'
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export { InfoList };
