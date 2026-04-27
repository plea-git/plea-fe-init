import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Filter } from './filter';

describe('Filter', () => {
  const FILTER_ITEMS = [
    { value: 'apple', label: '사과' },
    { value: 'banana', label: '바나나' },
    { value: 'orange', label: '오렌지' },
  ];

  const defaultProps = {
    items: FILTER_ITEMS,
    onChange: vi.fn(),
  };

  describe('기본 렌더링', () => {
    it('Trigger 버튼이 렌더링된다', () => {
      render(<Filter {...defaultProps} />);
      expect(screen.getByTitle('필터 열기')).toBeInTheDocument();
      expect(screen.getByText('필터')).toBeInTheDocument();
    });

    it('custom placeholder와 text를 설정할 수 있다', () => {
      render(<Filter {...defaultProps} placeholder="과일 선택" text="과일 필터" />);
      expect(screen.getByText('과일 선택')).toBeInTheDocument();
      expect(screen.getByTitle('과일 필터 열기')).toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('부모에서 value가 변경되면 Trigger의 카운트가 업데이트된다', () => {
      const { rerender } = render(<Filter {...defaultProps} value={[]} />);
      expect(screen.queryByText('1')).not.toBeInTheDocument();

      rerender(<Filter {...defaultProps} value={['apple']} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('선택된 항목 표시', () => {
    it('선택된 항목이 태그로 표시된다', () => {
      render(<Filter {...defaultProps} value={['apple', 'orange']} />);
      expect(screen.getByText('사과')).toBeInTheDocument();
      expect(screen.getByText('오렌지')).toBeInTheDocument();
    });

    it('태그의 삭제 버튼 클릭 시 해당 항목이 제거된다', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      const onChange = vi.fn();

      render(<Filter {...defaultProps} value={['apple']} onChange={onChange} />);

      const deleteButton = screen.getByTitle('삭제');
      await user.click(deleteButton);

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('외부 초기화 버튼 클릭 시 모든 선택이 해제된다', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      const onChange = vi.fn();

      render(<Filter items={FILTER_ITEMS} value={['apple', 'banana']} onChange={onChange} />);

      const resetButton = screen.getByTitle('전체 초기화');
      await user.click(resetButton);

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  // Note: Radix UI Popover 내부 인터랙션(열기 → 항목 선택 → 적용)은
  // 테스트 환경에서 포커스 트랩/애니메이션 이슈로 행이 걸릴 수 있음.
  // Popover 내부 동작은 Storybook에서 시각적으로 검증 권장.
});
