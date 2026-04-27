import { type NumberFormatValues, PatternFormat } from 'react-number-format';
import { BaseInput, type InputProps } from '@/shared/components/input/base-input';

/**
 * NumberInput 컴포넌트의 Props 타입
 * 기존 InputProps를 상속받으며, 패턴 포맷팅에 필요한 속성들이 추가되었습니다.
 */
export type NumberInputProps = Omit<InputProps, 'restriction'> & {
  /** 숫자가 입력될 패턴을 정의합니다.
   * '#'은 숫자가 들어갈 자리를 의미합니다.
   * @example '###-####-####' (전화번호)
   * @example '#### #### #### ####' (카드번호)
   */
  format: string;

  /** 입력값이 비어있을 때도 format에 정의된 mask를 화면에 노출할지 여부입니다.
   * @default false
   */
  allowEmptyFormatting?: boolean;

  /** 숫자가 입력되지 않은 자리에 보여줄 대체 문자입니다.
   * @default " " (공백)
   * @example mask="_"
   */
  mask?: string;

  /** 입력값 변경 시 호출될 함수입니다. */
  onValueChange?: (values: NumberFormatValues) => void;
};

/**
 * `react-number-format` 기반의 패턴 입력 컴포넌트입니다.
 * 지정된 패턴에 맞춰 숫자 입력을 제한하고 포맷팅합니다.
 * * @param props - 포맷 패턴 및 기본 Input 속성
 * @returns {JSX.Element} 포맷팅이 적용된 입력 필드
 */
export function NumberInput({
  format,
  allowEmptyFormatting,
  ref,
  value,
  defaultValue,
  mask,
  onValueChange,
  ...props
}: NumberInputProps) {
  return (
    <PatternFormat
      {...props}
      type={'text'}
      value={(value ?? '') as string}
      defaultValue={(defaultValue ?? '') as string}
      customInput={BaseInput}
      format={format}
      mask={mask}
      allowEmptyFormatting={allowEmptyFormatting}
      /** 입력값 변경 시 숫자형 문자열로 다루도록 설정 */
      valueIsNumericString
      getInputRef={ref}
      onValueChange={onValueChange}
    />
  );
}
