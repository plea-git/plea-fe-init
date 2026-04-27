import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectBox } from './SelectBox';

/**
 * NOTE: Radix UI Select는 `target.hasPointerCapture` 때문에 jsdom에서 interaction test 제한됨
 * - 렌더링 및 props 테스트에 집중
 * - 실제 인터랙션은 Storybook에서 검증 완료
 * - NumberInput과 유사한 케이스
 */

describe('SelectBox', () => {
  const basicOptions = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'orange', label: '오렌지' },
  ];

  const groupedOptions = [
    {
      label: '과일',
      options: [
        { value: 'apple', label: '사과' },
        { value: 'banana', label: '바나나' },
      ],
      separator: true,
    },
    {
      label: '채소',
      options: [
        { value: 'carrot', label: '당근' },
        { value: 'tomato', label: '토마토' },
      ],
    },
  ];

  const optionsWithDisabled = [
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성', disabled: true },
    { value: 'pending', label: '대기중' },
  ];

  describe('기본 렌더링', () => {
    it('Trigger가 렌더링된다', () => {
      render(<SelectBox options={basicOptions} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('첫 번째 옵션이 기본으로 선택된다', () => {
      render(<SelectBox options={basicOptions} />);

      expect(screen.getByRole('combobox')).toHaveTextContent('사과');
    });

    it('옵션 배열이 빈 경우에도 에러가 발생하지 않는다', () => {
      render(<SelectBox options={[]} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('defaultValue', () => {
    it('defaultValue prop이 적용된다', () => {
      render(<SelectBox options={basicOptions} defaultValue="orange" />);

      expect(screen.getByRole('combobox')).toHaveTextContent('오렌지');
    });

    it('defaultValue가 없으면 첫 번째 옵션이 선택된다', () => {
      render(<SelectBox options={basicOptions} />);

      expect(screen.getByRole('combobox')).toHaveTextContent('사과');
    });
  });

  describe('Grouped options', () => {
    it('그룹화된 옵션으로 렌더링된다', () => {
      render(<SelectBox options={groupedOptions} />);

      expect(screen.getByRole('combobox')).toHaveTextContent('사과');
    });

    it('그룹의 첫 번째 값이 defaultValue로 사용된다', () => {
      render(<SelectBox options={groupedOptions} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('그룹과 일반 옵션을 혼합할 수 있다', () => {
      const mixedOptions = [...groupedOptions, { value: 'mixed', label: '혼합 옵션' }];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render(<SelectBox options={mixedOptions as any} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Disabled', () => {
    it('disabled prop이 적용된다', () => {
      render(<SelectBox options={basicOptions} disabled />);

      const trigger = screen.getByRole('combobox');
      // Radix UI uses data-disabled instead of aria-disabled
      expect(trigger).toHaveAttribute('data-disabled');
    });

    it('개별 disabled 옵션을 가질 수 있다', () => {
      render(<SelectBox options={optionsWithDisabled} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Error 상태', () => {
    it('Error message가 표시된다', () => {
      render(
        <SelectBox
          options={basicOptions}
          errorMessage="필수 선택 항목입니다."
          showErrorMessage={true}
        />,
      );

      expect(screen.getByText('필수 선택 항목입니다.')).toBeInTheDocument();
    });

    it('showErrorMessage=false 시 에러 메시지가 숨겨진다', () => {
      render(
        <SelectBox options={basicOptions} errorMessage="에러 메시지" showErrorMessage={false} />,
      );

      expect(screen.queryByText('에러 메시지')).not.toBeInTheDocument();
    });
  });

  describe('React Hook Form', () => {
    it('onValueChange prop을 받을 수 있다', () => {
      const onValueChange = vi.fn();

      render(<SelectBox options={basicOptions} onValueChange={onValueChange} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('value prop으로 제어할 수 있다', () => {
      const { rerender } = render(<SelectBox<string> options={basicOptions} value="apple" />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('사과');

      rerender(<SelectBox<string> options={basicOptions} value="orange" />);

      expect(trigger).toHaveTextContent('오렌지');
    });
  });

  describe('Variants', () => {
    it('size="sm"을 적용할 수 있다', () => {
      render(<SelectBox options={basicOptions} size="sm" />);

      const trigger = screen.getByRole('combobox');
      // Radix UI uses data-size attribute
      expect(trigger).toHaveAttribute('data-size', 'sm');
    });

    it('size="default"가 기본값이다', () => {
      render(<SelectBox options={basicOptions} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-size', 'default');
    });

    it('bg="gray"를 적용할 수 있다', () => {
      render(<SelectBox options={basicOptions} bg="gray" />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('bg-gray-100');
    });

    it('bg="white"가 기본값이다', () => {
      render(<SelectBox options={basicOptions} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('bg-white');
    });

    it('className을 커스터마이징할 수 있다', () => {
      render(<SelectBox options={basicOptions} className="w-[300px]" />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('w-[300px]');
    });
  });

  describe('추가 기능', () => {
    it('placeholder를 설정할 수 있다', () => {
      render(<SelectBox options={basicOptions} placeholder="선택하세요" />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('triggerProps를 전달할 수 있다', () => {
      render(<SelectBox options={basicOptions} triggerProps={{ id: 'custom-id' }} />);

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('id', 'custom-id');
    });
  });
});
