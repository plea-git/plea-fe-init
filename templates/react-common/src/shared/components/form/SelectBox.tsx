import type * as SelectPrimitive from '@radix-ui/react-select';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

/** null value를 Radix UI에 전달하기 위한 내부 sentinel 값 */
const NULL_VALUE_SENTINEL = '__null__';

const toRadixValue = (v: string | null | undefined): string | undefined => {
  if (v === null) return NULL_VALUE_SENTINEL;
  return v ?? undefined;
};

const fromRadixValue = (v: string): string | null => (v === NULL_VALUE_SENTINEL ? null : v);

/**
 * Select 옵션 타입
 * @template T - value의 문자열 타입 (빈 문자열 불가)
 */
interface SelectOption<T extends string | number | null> {
  /** 옵션 값 (빈 문자열 불가) */
  value: T extends '' ? never : T;
  /** 옵션 표시 텍스트 */
  label: string;
  /** 옵션 비활성화 여부 */
  disabled?: boolean;
}

/**
 * Select 그룹화된 옵션 타입
 * @template T - value의 문자열 타입 (빈 문자열 불가)
 */
interface SelectOptionGroup<T extends string | number | null> {
  /** 그룹 레이블 */
  label: string;
  /** 그룹 내 옵션 목록 */
  options: SelectOption<T>[];
  /** 그룹 뒤에 구분선 표시 여부 @default false */
  separator?: boolean;
}

/**
 * 옵션이 그룹인지 판별하는 타입 가드
 */
function isSelectOptionGroup<T extends string | number | null>(
  option: SelectOption<T> | SelectOptionGroup<T>,
): option is SelectOptionGroup<T> {
  return 'options' in option && Array.isArray(option.options) && !('value' in option);
}

/**
 * SelectBox 컴포넌트의 Props
 * @template T - value의 문자열 타입 (빈 문자열 불가)
 */
interface SelectBoxProps<T extends string | number | null = string>
  extends Omit<React.ComponentProps<typeof SelectPrimitive.Root>, 'defaultValue' | 'value'> {
  /** 선택 가능한 옵션 목록 (일반 옵션 또는 그룹화된 옵션) */
  options: (SelectOption<T> | SelectOptionGroup<T>)[];

  /** placeholder 텍스트 */
  placeholder?: string;

  /** 크기 @default 'default' */
  size?: 'sm' | 'default';

  /** 배경색 @default 'white' */
  bg?: 'white' | 'gray';

  /** CSS 클래스명 @default 'w-[200px]' */
  className?: string;

  /** Trigger 컴포넌트에 전달할 추가 props */
  triggerProps?: Omit<
    React.ComponentProps<typeof SelectTrigger>,
    'children' | 'size' | 'bg' | 'className'
  >;

  /** Value 컴포넌트에 전달할 추가 props */
  valueProps?: React.ComponentProps<typeof SelectValue>;

  /** Content 컴포넌트에 전달할 추가 props */
  contentProps?: Omit<React.ComponentProps<typeof SelectContent>, 'children'>;

  /** 현재 선택 값 (null 허용) */
  value?: T | null;

  /** 기본 선택 값 (빈 문자열 불가, null 허용) */
  defaultValue?: (T extends '' ? never : T) | null;

  /** 에러 메시지 */
  errorMessage?: React.ReactNode;

  /** 에러 메시지 표시 여부 */
  showErrorMessage?: boolean;
}

/**
 * 드롭다운 선택 박스 컴포넌트
 *
 * Radix UI Select를 기반으로 만든 커스텀 Select 컴포넌트입니다.
 *
 * options의 value와 defaultValue의 타입은 빈 문자열 불가입니다.
 *
 * defaultValue가 없으면 options의 첫 번째 값이 기본 선택됩니다.
 *
 * @example
 * // 기본 사용
 * <SelectBox
 *   options={[
 *     { value: 'apple', label: '사과' },
 *     { value: 'banana', label: '바나나' }
 *   ]}
 * />
 *
 */
export function SelectBox<T extends string | number | null = string>({
  options,
  size = 'default',
  bg = 'white',
  className = 'w-[200px]',
  valueProps,
  contentProps,
  triggerProps,
  defaultValue,
  errorMessage,
  showErrorMessage,
  placeholder,
  ...props
}: SelectBoxProps<T>) {
  // 첫 번째 옵션 값을 추출하는 헬퍼 함수 (그룹 옵션 고려)
  const getFirstValue = (): T | undefined => {
    const firstOption = options[0];
    if (!firstOption) return undefined;
    return isSelectOptionGroup(firstOption) ? firstOption.options[0]?.value : firstOption.value;
  };

  const initialValue = defaultValue !== undefined ? defaultValue : getFirstValue();

  // React Hook Form의 onChange를 Radix UI의 onValueChange로 매핑
  const {
    onChange,
    value: controlledValue,
    ...restProps
  } = props as typeof props & {
    onChange?: (value: string | null) => void;
  };
  const selectProps = {
    ...restProps,
    onValueChange: (v: string) => {
      const converted = fromRadixValue(v);
      if (converted === null) {
        // null sentinel인 경우 그대로 null 반환
        onChange?.(converted);
      } else {
        // Radix는 항상 string을 반환하므로, 원본 options에서 타입이 보존된 value를 역탐색
        const allOptions = options.flatMap((opt) =>
          isSelectOptionGroup(opt) ? opt.options : [opt],
        );
        const originalOption = allOptions.find((opt) => toRadixValue(String(opt.value)) === v);
        // 원본 typed value가 있으면 사용, 없으면 string 그대로
        onChange?.((originalOption?.value ?? converted) as string | null);
      }
      restProps.onValueChange?.(v);
    },
  };

  // null: Radix를 controlled 모드로 유지하면서 placeholder를 표시하기 위해 ""을 전달
  //   → value=undefined이면 Radix가 uncontrolled로 전환되어 직전 값을 계속 표시하는 버그 발생
  //   → ""에 매칭되는 옵션은 타입 레벨에서 금지되어 있으므로 항상 placeholder가 표시됨
  // undefined: defaultValue를 사용하는 비제어 초기 상태
  const radixValue =
    controlledValue !== undefined
      ? controlledValue === null
        ? ''
        : toRadixValue(String(controlledValue))
      : undefined;
  const radixDefaultValue =
    initialValue !== undefined ? toRadixValue(String(initialValue)) : undefined;

  return (
    <Select
      {...selectProps}
      value={radixValue}
      defaultValue={controlledValue === undefined ? radixDefaultValue : undefined}
      errorMessage={errorMessage}
      showErrorMessage={showErrorMessage}
    >
      <SelectTrigger size={size} bg={bg} className={className} {...triggerProps}>
        <SelectValue {...valueProps} placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        {options.map((option) => {
          if (isSelectOptionGroup(option)) {
            return (
              <React.Fragment key={option.label}>
                <SelectGroup>
                  <SelectLabel>{option.label}</SelectLabel>
                  {option.options.map((item) => {
                    const radixItemValue = toRadixValue(String(item.value)) ?? item.label;
                    return (
                      <SelectItem
                        key={radixItemValue}
                        value={radixItemValue}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
                {option.separator && <SelectSeparator />}
              </React.Fragment>
            );
          }

          const radixItemValue = toRadixValue(String(option.value)) ?? option.label;
          return (
            <SelectItem key={radixItemValue} value={radixItemValue} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
