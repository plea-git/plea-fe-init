import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/shared/lib/utils';

const tableRowSizeVariants = cva('', {
  variants: {
    rowSize: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    rowSize: 'lg',
  },
});

function TableColGroup(props: React.ComponentProps<'colgroup'>) {
  return <colgroup {...props} />;
}

function TableCol(props: React.ComponentProps<'col'>) {
  return <col {...props} />;
}

interface TableProps
  extends React.ComponentProps<'table'>,
    VariantProps<typeof tableRowSizeVariants> {
  scrollable?: boolean;
  maxHeight?: number | string;
  minHeight?: number | string;
}

function Table({
  className,
  scrollable = false,
  maxHeight,
  minHeight,
  rowSize,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn('relative w-full overflow-x-auto', scrollable && 'overflow-y-auto')}
      style={
        scrollable && (maxHeight || minHeight)
          ? {
              ...(maxHeight && {
                maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
              }),
              ...(minHeight && {
                minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
              }),
            }
          : undefined
      }
    >
      <table
        data-slot="table"
        data-row-size={rowSize}
        className={cn(
          'w-full table-fixed caption-bottom text-sm text-[#797d82]',
          tableRowSizeVariants({ rowSize }),
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('sticky top-0 z-10 bg-gray-100 [&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn('', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-15 px-2 text-center align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        '[&:first-child]:rounded-l-[0.875rem] [&:last-child]:rounded-r-[0.875rem]',
        '[table[data-row-size=sm]_&]:h-10',
        '[table[data-row-size=md]_&]:h-13',
        '[table[data-row-size=lg]_&]:h-15',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'h-15 p-2 text-center align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        '[table[data-row-size=sm]_&]:h-10',
        '[table[data-row-size=md]_&]:h-13',
        '[table[data-row-size=lg]_&]:h-15',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCol,
  TableColGroup,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
