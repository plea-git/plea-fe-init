import type { ReactNode } from 'react';
import { GeneralTooltip } from '@/shared/components/tooltip/general-tooltip';
import { cn } from '@/shared/lib/utils';
import { Label } from '@/shared/ui/label';

interface LabeledFieldProps {
  /** 라벨 텍스트 */
  label: string;
  /** 라벨과 연결할 input id */
  htmlFor?: string;
  /** 필수 입력 여부 */
  required?: boolean;
  /** 툴팁 내용 */
  tooltip?: string;
  /** 라벨 아래 도움말 텍스트 */
  description?: string;
  /** 입력 필드 아래 도움말 텍스트 */
  helpText?: string;
  /** 자식 요소 (input, select 등) */
  children: ReactNode;
  /** 추가 클래스명 */
  className?: string;
}

export function LabeledField({
  label,
  htmlFor,
  required = false,
  tooltip,
  description,
  helpText,
  children,
  className,
}: LabeledFieldProps) {
  return (
    <div className={cn('grid gap-3', className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
        {tooltip && <GeneralTooltip content={tooltip} />}
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <div>
        {children}
        {helpText && <p className="mt-2.5 text-xs text-gray-500">{helpText}</p>}
      </div>
    </div>
  );
}
