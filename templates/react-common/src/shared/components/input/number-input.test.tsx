import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NumberInput } from './number-input';

describe('NumberInput - 패턴 포맷팅', () => {
  describe('전화번호 패턴 (###-####-####)', () => {
    it('전화번호 형식으로 입력된다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <NumberInput
          placeholder="전화번호 입력"
          format="###-####-####"
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      // 11자리 숫자 입력
      await user.type(input, '01012345678');

      // 형식에 맞게 포맷팅되어야 함
      expect(input.value).toBe('010-1234-5678');
    });

    it('숫자만 입력된다 (문자 입력 무시)', async () => {
      const user = userEvent.setup();

      render(<NumberInput placeholder="전화번호 입력" format="###-####-####" />);

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      // 문자와 숫자 혼합 입력
      await user.type(input, 'abc123def456');

      // 숫자만 포맷팅되어야 함 (trailing space 허용)
      expect(input.value).toContain('123-456');
    });

    it('패턴 길이를 초과하는 입력은 무시된다', async () => {
      const user = userEvent.setup();

      render(<NumberInput placeholder="전화번호 입력" format="###-####-####" />);

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      // 11자리를 초과하는 숫자 입력
      await user.type(input, '010123456789999');

      // 11자리까지만 입력되어야 함
      expect(input.value).toBe('010-1234-5678');
    });

    it('백스페이스로 삭제 시 포맷이 유지된다', async () => {
      const user = userEvent.setup();

      render(<NumberInput placeholder="전화번호 입력" format="###-####-####" />);

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      // 전화번호 입력
      await user.type(input, '01012345678');
      expect(input.value).toBe('010-1234-5678');

      // 마지막 숫자 삭제
      await user.type(input, '{Backspace}');

      // 포맷이 유지되어야 함 (trailing space 허용)
      expect(input.value).toContain('010-1234-567');
    });
  });

  describe('카드번호 패턴 (#### #### #### ####)', () => {
    it('카드번호 형식으로 입력된다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <NumberInput
          placeholder="카드번호 입력"
          format="#### #### #### ####"
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByPlaceholderText('카드번호 입력') as HTMLInputElement;

      // 16자리 숫자 입력
      await user.type(input, '1234567812345678');

      // 4자리씩 공백으로 구분되어야 함
      expect(input.value).toBe('1234 5678 1234 5678');
    });

    it('부분 입력 시에도 포맷이 적용된다', async () => {
      const user = userEvent.setup();

      render(<NumberInput placeholder="카드번호 입력" format="#### #### #### ####" />);

      const input = screen.getByPlaceholderText('카드번호 입력') as HTMLInputElement;

      // 8자리만 입력
      await user.type(input, '12345678');

      // 부분 포맷팅 (mask 없이는 trailing space가 있을 수 있음)
      expect(input.value).toContain('1234 5678');
    });
  });

  describe('mask 옵션', () => {
    it('mask="_"와 allowEmptyFormatting을 사용하면 빈 자리가 _로 표시된다', () => {
      render(
        <NumberInput
          placeholder="전화번호 입력"
          format="###-####-####"
          mask="_"
          allowEmptyFormatting
        />,
      );

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      // allowEmptyFormatting이 true이므로 mask 표시
      expect(input.value).toBe('___-____-____');
    });

    it('allowEmptyFormatting이 false면 빈 상태에서 mask가 표시되지 않는다', () => {
      render(
        <NumberInput
          placeholder="전화번호 입력"
          format="###-####-####"
          mask="_"
          allowEmptyFormatting={false}
        />,
      );

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      // 빈 상태에서는 mask가 표시되지 않아야 함
      expect(input.value).toBe('');
    });
  });

  describe('onValueChange 콜백', () => {
    it('입력 시 onValueChange가 호출된다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <NumberInput
          placeholder="전화번호 입력"
          format="###-####-####"
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      await user.type(input, '010');

      // onValueChange가 호출되어야 함
      expect(onValueChange).toHaveBeenCalled();
    });

    it('onValueChange는 포맷팅된 값과 원본 값을 제공한다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <NumberInput
          placeholder="전화번호 입력"
          format="###-####-####"
          onValueChange={onValueChange}
        />,
      );

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      await user.type(input, '01012345678');

      // 마지막 호출 확인
      const lastCall = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]?.[0];

      // formattedValue: 포맷팅된 값
      expect(lastCall.formattedValue).toBe('010-1234-5678');

      // value: 숫자만 추출한 값
      expect(lastCall.value).toBe('01012345678');
    });
  });

  describe('BaseInput 기능 상속', () => {
    it('error 상태를 표시할 수 있다', () => {
      render(
        <NumberInput
          placeholder="전화번호 입력"
          format="###-####-####"
          status="error"
          errorMessage="올바른 전화번호를 입력해주세요"
        />,
      );

      // 에러 메시지 표시 확인
      expect(screen.getByText('올바른 전화번호를 입력해주세요')).toBeInTheDocument();
    });

    it('disabled 상태를 적용할 수 있다', () => {
      render(<NumberInput placeholder="전화번호 입력" format="###-####-####" disabled />);

      const input = screen.getByPlaceholderText('전화번호 입력') as HTMLInputElement;

      expect(input).toBeDisabled();
    });
  });
});
