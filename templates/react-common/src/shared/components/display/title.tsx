import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

export const titleVariants = cva('font-bold leading-none text-gray-900', {
  variants: {
    size: {
      xs: 'text-lg',
      sm: 'text-xl',
      default: 'text-xl',
      lg: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface TitleProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof titleVariants> {
  main?: boolean;
}

function Title({ className, size, main = false, ...props }: TitleProps) {
  const Tag = main ? 'h1' : 'strong';
  return <Tag className={cn(titleVariants({ size }), className)} {...props} />;
}

export { Title };
