import { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';

/* =========================================================
 * 내부 전용 hook (파일 내부에서만 사용)
 * ======================================================= */
function useCheckboxGroup<T extends string>(values: readonly T[], onChange?: (value: T[]) => void) {
  const [selected, setSelected] = useState<T[]>([]);

  const isAllChecked = values.length > 0 && values.every((v) => selected.includes(v));

  const isIndeterminate = selected.length > 0 && !isAllChecked;

  const toggleAll = (checked: boolean) => {
    const newVal = checked ? [...values] : [];
    setSelected(newVal);
    onChange?.(newVal);
  };

  const toggle = (value: T, checked: boolean) => {
    setSelected((prev) => {
      const newVal = checked ? [...prev, value] : prev.filter((v) => v !== value);
      onChange?.(newVal);
      return newVal;
    });
  };

  return {
    selected,
    setSelected,
    isAllChecked,
    isIndeterminate,
    toggleAll,
    toggle,
  };
}

/* =========================================================
 * CheckboxGroup 컴포넌트
 * ======================================================= */
interface CheckboxGroupProps<T extends string> {
  values: readonly T[];
  labels: Record<T, string>;
  allLabel?: string;
  value?: T[];
  onChange?: (value: T[]) => void;
  idPrefix?: string;
  className?: string;
}

export function CheckboxGroup<T extends string>({
  values,
  labels,
  allLabel = '전체',
  value,
  onChange,
  idPrefix = 'checkbox-group',
  className,
}: CheckboxGroupProps<T>) {
  // onChange callback을 ref에 저장하여 최신 상태 유지 (useCheckboxGroup에 전달)
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleGroupChange = useCallback((newVal: T[]) => {
    onChangeRef.current?.(newVal);
  }, []);

  const group = useCheckboxGroup(values, handleGroupChange);

  const { selected, setSelected, isAllChecked, toggleAll, toggle } = group;

  /* 🔹 controlled value → 내부 state 동기화 */
  useEffect(() => {
    if (value !== undefined) {
      // 값이 실제로 다를 때만 업데이트
      const isSame = value.length === selected.length && value.every((v) => selected.includes(v));
      if (!isSame) {
        setSelected(value);
      }
    }
  }, [value, selected, setSelected]);

  return (
    <div className={`flex gap-4 ${className ?? ''}`}>
      {/* ================= 전체 ================= */}
      <div className="flex items-center gap-2">
        <Checkbox
          id={`${idPrefix}-all`}
          checked={isAllChecked}
          onCheckedChange={(checked) => toggleAll(checked === true)}
        />
        <Label htmlFor={`${idPrefix}-all`}>{allLabel}</Label>
      </div>

      {/* ================= 개별 ================= */}
      {values.map((v) => {
        const id = `${idPrefix}-${v}`;

        return (
          <div key={v} className="flex items-center gap-2">
            <Checkbox
              id={id}
              checked={selected.includes(v)}
              onCheckedChange={(checked) => toggle(v, checked === true)}
            />
            <Label htmlFor={id}>{labels[v]}</Label>
          </div>
        );
      })}
    </div>
  );
}
