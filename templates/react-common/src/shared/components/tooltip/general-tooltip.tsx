import { CircleAlert } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

interface GeneralTooltipProps {
  /** 툴팁 내용 */
  content: ReactNode;
  /** 커스텀 트리거 요소 (없으면 아이콘 사용) */
  children?: ReactNode;
  /** 아이콘 컴포넌트 (기본값: CircleAlert) */
  icon?: ComponentType<{ className?: string }>;
  /** 아이콘 클래스명 */
  iconClassName?: string;
  contentClassName?: string;
  className?: string;
}

export function GeneralTooltip({
  content,
  children,
  icon: Icon = CircleAlert,
  iconClassName,
  contentClassName,
  className,
}: GeneralTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger type="button" asChild={!!children} className={cn(className)}>
        {children ?? <Icon className={cn('size-3.5 text-gray-400', iconClassName)} />}
      </TooltipTrigger>
      <TooltipContent className={cn(contentClassName, '')}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </TooltipContent>
    </Tooltip>
  );
}
