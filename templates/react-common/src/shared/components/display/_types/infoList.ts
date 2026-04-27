import { cva, type VariantProps } from 'class-variance-authority';

export interface InfoItem {
  label: string | React.ReactNode;
  value: string | React.ReactNode;
  tooltipContents?: string | React.ReactNode;
  tooltipLocation?: 'label' | 'value';
  isDot?: boolean;
  align?: 'start' | 'center';
  full?: boolean;
}

export const infoListVariants = cva(
  'flex flex-wrap gap-5 gap-y-6 text-sm font-medium text-gray-600',
  {
    variants: {
      columns: {
        4: '',
        3: '',
        2: '',
        1: 'flex-col',
      },
    },
    defaultVariants: {
      columns: 2,
    },
  },
);

export interface InfoListProps extends VariantProps<typeof infoListVariants> {
  items: InfoItem[];
  labelWidth?: number;
  className?: string;
  isDot?: boolean;
}
