import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxGroup } from './checkboxGroup';

describe('CheckboxGroup', () => {
  const STATUS_VALUES = ['pending', 'approved', 'rejected'] as const;
  const STATUS_LABELS = {
    pending: '대기중',
    approved: '승인',
    rejected: '거절',
  } as const;

  describe('기본 렌더링', () => {
    it('"전체" 라벨이 표시된다', () => {
      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      expect(screen.getByText('전체')).toBeInTheDocument();
    });

    it('모든 value가 렌더링된다', () => {
      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      expect(screen.getByText('대기중')).toBeInTheDocument();
      expect(screen.getByText('승인')).toBeInTheDocument();
      expect(screen.getByText('거절')).toBeInTheDocument();
    });

    it('Label 클릭으로 체크박스를 토글할 수 있다', async () => {
      const user = userEvent.setup();

      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      const pendingCheckbox = screen.getByRole('checkbox', { name: '대기중' });

      expect(pendingCheckbox).not.toBeChecked();

      // Label 클릭
      await user.click(screen.getByText('대기중'));

      expect(pendingCheckbox).toBeChecked();
    });
  });

  describe('"전체" 체크박스', () => {
    it('"전체" 클릭 시 모든 항목이 선택된다', async () => {
      const user = userEvent.setup();

      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      const allCheckbox = screen.getByRole('checkbox', { name: '전체' });
      const pendingCheckbox = screen.getByRole('checkbox', { name: '대기중' });
      const approvedCheckbox = screen.getByRole('checkbox', { name: '승인' });
      const rejectedCheckbox = screen.getByRole('checkbox', { name: '거절' });

      // 모두 체크되지 않은 상태
      expect(allCheckbox).not.toBeChecked();
      expect(pendingCheckbox).not.toBeChecked();

      // "전체" 클릭
      await user.click(allCheckbox);

      // 모든 항목 체크됨
      expect(allCheckbox).toBeChecked();
      expect(pendingCheckbox).toBeChecked();
      expect(approvedCheckbox).toBeChecked();
      expect(rejectedCheckbox).toBeChecked();
    });

    it('"전체" 해제 시 모든 항목이 해제된다', async () => {
      const user = userEvent.setup();

      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      const allCheckbox = screen.getByRole('checkbox', { name: '전체' });
      const pendingCheckbox = screen.getByRole('checkbox', { name: '대기중' });

      // 먼저 전체 선택
      await user.click(allCheckbox);
      expect(allCheckbox).toBeChecked();
      expect(pendingCheckbox).toBeChecked();

      // 전체 해제
      await user.click(allCheckbox);

      expect(allCheckbox).not.toBeChecked();
      expect(pendingCheckbox).not.toBeChecked();
    });

    it('모든 항목 선택 시 "전체"가 자동으로 체크된다', async () => {
      const user = userEvent.setup();

      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      const allCheckbox = screen.getByRole('checkbox', { name: '전체' });

      // 개별 항목을 하나씩 선택
      await user.click(screen.getByText('대기중'));
      await user.click(screen.getByText('승인'));
      await user.click(screen.getByText('거절'));

      // "전체" 자동 체크됨
      expect(allCheckbox).toBeChecked();
    });

    it('일부만 선택 시 "전체"는 체크되지 않는다', async () => {
      const user = userEvent.setup();

      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      const allCheckbox = screen.getByRole('checkbox', { name: '전체' });

      // 일부만 선택
      await user.click(screen.getByText('대기중'));

      expect(allCheckbox).not.toBeChecked();
    });
  });

  describe('개별 체크박스', () => {
    it('개별 항목을 선택하고 해제할 수 있다', async () => {
      const user = userEvent.setup();

      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      const pendingCheckbox = screen.getByRole('checkbox', { name: '대기중' });

      expect(pendingCheckbox).not.toBeChecked();

      // 선택
      await user.click(pendingCheckbox);
      expect(pendingCheckbox).toBeChecked();

      // 해제
      await user.click(pendingCheckbox);
      expect(pendingCheckbox).not.toBeChecked();
    });

    it('여러 항목을 동시에 선택할 수 있다', async () => {
      const user = userEvent.setup();

      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} />);

      const pendingCheckbox = screen.getByRole('checkbox', { name: '대기중' });
      const approvedCheckbox = screen.getByRole('checkbox', { name: '승인' });

      // 두 항목 선택
      await user.click(pendingCheckbox);
      await user.click(approvedCheckbox);

      expect(pendingCheckbox).toBeChecked();
      expect(approvedCheckbox).toBeChecked();
    });
  });

  describe('Controlled mode', () => {
    it('value prop으로 선택 상태를 제어할 수 있다', () => {
      const { rerender } = render(
        <CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} value={['pending']} />,
      );

      const pendingCheckbox = screen.getByRole('checkbox', { name: '대기중' });
      const approvedCheckbox = screen.getByRole('checkbox', { name: '승인' });

      expect(pendingCheckbox).toBeChecked();
      expect(approvedCheckbox).not.toBeChecked();

      // value 변경
      rerender(
        <CheckboxGroup
          values={STATUS_VALUES}
          labels={STATUS_LABELS}
          value={['pending', 'approved']}
        />,
      );

      expect(pendingCheckbox).toBeChecked();
      expect(approvedCheckbox).toBeChecked();
    });

    it('onChange 콜백이 호출된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} onChange={onChange} />);

      // 항목 클릭
      await user.click(screen.getByText('대기중'));

      // onChange 호출됨
      expect(onChange).toHaveBeenCalledWith(['pending']);
    });

    it('외부 value 변경 시 UI가 업데이트된다', () => {
      const { rerender } = render(
        <CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} value={[]} />,
      );

      const pendingCheckbox = screen.getByRole('checkbox', { name: '대기중' });

      expect(pendingCheckbox).not.toBeChecked();

      // 외부에서 value 변경
      rerender(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} value={['pending']} />);

      expect(pendingCheckbox).toBeChecked();
    });
  });

  describe('Custom props', () => {
    it('allLabel을 커스터마이징할 수 있다', () => {
      render(<CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} allLabel="전체 유형" />);

      expect(screen.getByText('전체 유형')).toBeInTheDocument();
      expect(screen.queryByText('전체')).not.toBeInTheDocument();
    });

    it('idPrefix가 적용된다', () => {
      render(
        <CheckboxGroup values={STATUS_VALUES} labels={STATUS_LABELS} idPrefix="status-filter" />,
      );

      // ID 확인
      const allCheckbox = screen.getByRole('checkbox', { name: '전체' });
      const pendingCheckbox = screen.getByRole('checkbox', { name: '대기중' });

      expect(allCheckbox).toHaveAttribute('id', 'status-filter-all');
      expect(pendingCheckbox).toHaveAttribute('id', 'status-filter-pending');
    });
  });
});
