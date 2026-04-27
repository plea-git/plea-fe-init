import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  const defaultOptions = [
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3' },
  ];

  describe('기본 렌더링', () => {
    it('모든 옵션이 렌더링된다', () => {
      render(<RadioGroup options={defaultOptions} />);

      expect(screen.getByText('옵션 1')).toBeInTheDocument();
      expect(screen.getByText('옵션 2')).toBeInTheDocument();
      expect(screen.getByText('옵션 3')).toBeInTheDocument();
    });

    it('첫 번째 옵션이 기본으로 선택된다', () => {
      render(<RadioGroup options={defaultOptions} />);

      const option1 = screen.getByRole('radio', { name: '옵션 1' });
      expect(option1).toBeChecked();
    });
  });

  describe('단일 선택', () => {
    it('하나의 옵션만 선택할 수 있다', async () => {
      const user = userEvent.setup();

      render(<RadioGroup options={defaultOptions} />);

      const option1 = screen.getByRole('radio', { name: '옵션 1' });
      const option2 = screen.getByRole('radio', { name: '옵션 2' });

      // 처음에는 option1이 선택됨
      expect(option1).toBeChecked();

      // option2 선택
      await user.click(option2);

      expect(option2).toBeChecked();
      expect(option1).not.toBeChecked();
    });

    it('Label 클릭으로 선택할 수 있다', async () => {
      const user = userEvent.setup();

      render(<RadioGroup options={defaultOptions} />);

      const option2 = screen.getByRole('radio', { name: '옵션 2' });

      await user.click(screen.getByText('옵션 2'));

      expect(option2).toBeChecked();
    });
  });

  describe('defaultValue', () => {
    it('defaultValue로 초기 선택값을 설정할 수 있다', () => {
      render(<RadioGroup options={defaultOptions} defaultValue="option2" />);

      const option2 = screen.getByRole('radio', { name: '옵션 2' });
      expect(option2).toBeChecked();
    });

    it('defaultValue가 없으면 첫 번째 옵션이 선택된다', () => {
      render(<RadioGroup options={defaultOptions} />);

      const option1 = screen.getByRole('radio', { name: '옵션 1' });
      expect(option1).toBeChecked();
    });
  });

  describe('onValueChange 콜백', () => {
    it('옵션 선택 시 onValueChange가 호출된다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<RadioGroup options={defaultOptions} onValueChange={onValueChange} />);

      const option2 = screen.getByRole('radio', { name: '옵션 2' });
      await user.click(option2);

      expect(onValueChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('Variants', () => {
    it('variant="default"가 기본값이다', () => {
      const { container } = render(<RadioGroup options={defaultOptions} />);

      // default variant는 gap-[30px]를 가짐
      const radioGroup = container.querySelector('[role="radiogroup"]');
      expect(radioGroup).toHaveClass('gap-[30px]');
    });

    it('variant="outline"을 적용할 수 있다', () => {
      render(<RadioGroup options={defaultOptions} variant="outline" />);

      // outline variant는 각 옵션에 border가 추가됨
      const option1Radio = screen.getByRole('radio', { name: '옵션 1' });
      const option1Container = option1Radio.closest('div');

      expect(option1Container).toHaveClass('border');
      expect(option1Container).toHaveClass('rounded-lg');
    });
  });

  describe('Disabled 상태', () => {
    it('groupDisabled로 전체를 비활성화할 수 있다', () => {
      render(<RadioGroup options={defaultOptions} groupDisabled />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('data-disabled');
    });

    it('개별 옵션을 disabled할 수 있다', () => {
      const optionsWithDisabled = [
        ...defaultOptions,
        { value: 'option4', label: '옵션 4', disabled: true },
      ];

      render(<RadioGroup options={optionsWithDisabled} />);

      const option4 = screen.getByRole('radio', { name: '옵션 4' });
      expect(option4).toBeDisabled();
    });
  });

  describe('Readonly 상태', () => {
    it('groupReadonly로 읽기 전용 모드를 설정할 수 있다', () => {
      render(<RadioGroup options={defaultOptions} groupReadonly />);

      const radioGroup = screen.getByRole('radiogroup');
      // readonly는 disabled attribute로 구현됨
      expect(radioGroup).toHaveAttribute('data-disabled');
    });
  });
});
