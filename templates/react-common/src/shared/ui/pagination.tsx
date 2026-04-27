import {
  ChevronLeftIcon,
  ChevronRightIcon,
  // MoreHorizontalIcon,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { type Button, buttonVariants } from '@/shared/ui/button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>;
function PaginationLink({
  className,
  isActive,
  size = 'icon-sm',
  children,
  'aria-label': ariaLabel,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      aria-label={ariaLabel}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({ size }),
        'hover:border-primary-400 hover:text-primary-400 rounded-md border border-gray-400 bg-white text-gray-400 hover:bg-white',
        isActive && 'border-primary-400 text-primary-400 bg-white',
        className,
      )}
      {...props}
    >
      {children}
      {!children && ariaLabel && <span className="sr-only">{ariaLabel}</span>}
    </a>
  );
}
function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" className={cn(className)} {...props}>
      <span className="sr-only">이전</span>
      <ChevronLeftIcon />
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" className={cn(className)} {...props}>
      <span className="sr-only">다음</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationFirst({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to first page" className={cn(className)} {...props}>
      <span className="sr-only">맨 처음</span>
      <ChevronsLeft />
    </PaginationLink>
  );
}

function PaginationLast({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to last page" className={cn(className)} {...props}>
      <span className="sr-only">맨 끝</span>
      <ChevronsRight />
    </PaginationLink>
  );
}

// function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
//   return (
//     <span
//       aria-hidden
//       data-slot="pagination-ellipsis"
//       className={cn('flex size-9 items-center justify-center', className)}
//       {...props}
//     >
//       <MoreHorizontalIcon className="size-4" />
//       <span className="sr-only">More pages</span>
//     </span>
//   )
// }

export {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
