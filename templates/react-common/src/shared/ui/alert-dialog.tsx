import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { AlertCircleIcon, AlertTriangleIcon, CheckCircle2, CircleX, Trash2, X } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/shared/lib/utils';
import type { ConfirmIconVariant } from '@/shared/types/icon.types';
import { buttonVariants } from '@/shared/ui/button';

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}
function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  );
}
interface CustomAlertDialogContentProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
  icon?: ConfirmIconVariant;
}

const ICON_VARIANTS: Record<ConfirmIconVariant, React.ReactNode> = {
  warning: <AlertTriangleIcon className="size-6 text-yellow-500" />,
  info: <AlertCircleIcon className="size-6 text-blue-500" />,
  success: <CheckCircle2 className="size-6 text-green-500" />,
  delete: <Trash2 className="size-6 text-red-500" />,
  deny: <X className="size-6 text-red-500" />,
  error: <CircleX className="size-6 text-red-500" />,
};

function AlertDialogContent({
  className,
  icon = 'info',
  children,
  ...props
}: CustomAlertDialogContentProps) {
  const renderIcon = () => {
    if (typeof icon === 'string' && icon in ICON_VARIANTS) {
      return ICON_VARIANTS[icon as ConfirmIconVariant];
    }
    return icon as React.ReactNode;
  };
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-[1.25rem] border p-6 shadow-lg duration-200 sm:max-w-lg',
          className,
        )}
        {...props}
      >
        {icon && <div className="mb-3.5 flex justify-center">{renderIcon()}</div>}

        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}
function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-center', className)}
      {...props}
    />
  );
}
function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('mt-7.5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center', className)}
      {...props}
    />
  );
}
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-base font-medium', className)}
      {...props}
    />
  );
}
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}
function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(
        buttonVariants({ size: 'sm' }),
        'w-[100px] bg-gray-600 hover:bg-gray-500',
        className,
      )}
      {...props}
    />
  );
}
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-[100px]', className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
