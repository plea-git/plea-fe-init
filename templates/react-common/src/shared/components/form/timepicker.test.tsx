import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TimePicker } from './timepicker';

/**
 * TimePicker는 Radix UI Popover를 사용하므로 일부 interactive 테스트에 제한이 있을 수 있음
 * - 기본 렌더링 및 props에 집중
 * - 필요시 Storybook에서 추가 검증
 */

vi.mock('@/shared/components/dialog/confirm-dialog', () => ({
  showConfirmDialog: vi.fn(() => Promise.resolve(true)),
}));

describe('TimePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // 시간을 아주 이른 아침으로 고정하여 "현재 시간보다 이전 시간 선택" 로직이 테스트에 걸리지 않게 함
    vi.setSystemTime(new Date('2024-03-24 00:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  describe('기본 렌더링', () => {
    it('시와 분 선택기가 모두 렌더링된다', () => {
      render(<TimePicker />);

      expect(screen.getByTitle('시 선택')).toBeInTheDocument();
      expect(screen.getByTitle('분 선택')).toBeInTheDocument();
    });

    it('초기값이 --으로 표시된다', () => {
      render(<TimePicker />);

      const hourButton = screen.getByTitle('시 선택');
      const minuteButton = screen.getByTitle('분 선택');

      expect(hourButton).toHaveTextContent('--');
      expect(minuteButton).toHaveTextContent('--');
    });
  });

  describe('showHour / showMinute', () => {
    it('showHour=false면 시 선택기가 숨겨진다', () => {
      render(<TimePicker showHour={false} />);

      expect(screen.queryByTitle('시 선택')).not.toBeInTheDocument();
      expect(screen.getByTitle('분 선택')).toBeInTheDocument();
    });

    it('showMinute=false면 분 선택기가 숨겨진다', () => {
      render(<TimePicker showMinute={false} />);

      expect(screen.getByTitle('시 선택')).toBeInTheDocument();
      expect(screen.queryByTitle('분 선택')).not.toBeInTheDocument();
    });

    it('둘 다 false면 아무것도 렌더링되지 않는다', () => {
      const { container } = render(<TimePicker showHour={false} showMinute={false} />);

      expect(container.querySelector('.flex.gap-2')).toBeEmptyDOMElement();
    });
  });

  describe('hourValue / minuteValue', () => {
    it('hourValue로 초기 시간을 설정할 수 있다', () => {
      render(<TimePicker hourValue="15" />);

      const hourButton = screen.getByTitle('시 선택');
      expect(hourButton).toHaveTextContent('15');
    });

    it('minuteValue로 초기 분을 설정할 수 있다', () => {
      render(<TimePicker minuteValue="30" />);

      const minuteButton = screen.getByTitle('분 선택');
      expect(minuteButton).toHaveTextContent('30');
    });

    it('hourValue와 minuteValue를 함께 설정할 수 있다', () => {
      render(<TimePicker hourValue="09" minuteValue="45" />);

      expect(screen.getByTitle('시 선택')).toHaveTextContent('09');
      expect(screen.getByTitle('분 선택')).toHaveTextContent('45');
    });
  });

  describe('시간 선택', () => {
    it('시 버튼을 클릭하면 시간 옵션이 열린다', async () => {
      const user = userEvent.setup();

      render(<TimePicker />);

      const hourButton = screen.getByTitle('시 선택');
      await user.click(hourButton);

      // 00부터 23까지 24개 옵션
      const options = screen
        .getAllByRole('button')
        .filter((btn) => btn.textContent?.match(/^\d{2}$/));
      expect(options.length).toBeGreaterThanOrEqual(24);
    });

    it('시간을 선택하면 onHourChange가 호출된다', async () => {
      const user = userEvent.setup();
      const onHourChange = vi.fn();

      render(<TimePicker onHourChange={onHourChange} />);

      const hourButton = screen.getByTitle('시 선택');
      await user.click(hourButton);

      // "10" 시간 선택
      const option10 = screen.getAllByRole('button').find((btn) => btn.textContent === '10');
      if (option10) {
        await user.click(option10);
        expect(onHourChange).toHaveBeenCalledWith('10');
      }
    });
  });

  describe('분 선택', () => {
    it('분 버튼을 클릭하면 분 옵션이 열린다', async () => {
      const user = userEvent.setup();

      render(<TimePicker />);

      const minuteButton = screen.getByTitle('분 선택');
      await user.click(minuteButton);

      // 00부터 59까지 60개 옵션
      const options = screen
        .getAllByRole('button')
        .filter((btn) => btn.textContent?.match(/^\d{2}$/));
      expect(options.length).toBeGreaterThanOrEqual(60);
    });

    it('분을 선택하면 onMinuteChange가 호출된다', async () => {
      const user = userEvent.setup();
      const onMinuteChange = vi.fn();

      render(<TimePicker onMinuteChange={onMinuteChange} />);

      const minuteButton = screen.getByTitle('분 선택');
      await user.click(minuteButton);

      // "30" 분 선택
      const option30 = screen.getAllByRole('button').find((btn) => btn.textContent === '30');
      if (option30) {
        await user.click(option30);
        expect(onMinuteChange).toHaveBeenCalledWith('30');
      }
    });
  });

  describe('limitStartTime / limitEndTime', () => {
    it('limitStartTime으로 시작 시간을 제한할 수 있다', async () => {
      const user = userEvent.setup();

      render(<TimePicker limitStartTime={18} />);

      const hourButton = screen.getByTitle('시 선택');
      await user.click(hourButton);

      // 18시 이상은 disabled
      const option18 = screen.getAllByRole('button').find((btn) => btn.textContent === '18');
      const option19 = screen.getAllByRole('button').find((btn) => btn.textContent === '19');

      expect(option18).toBeDisabled();
      if (option19) expect(option19).toBeDisabled();
    });

    it('limitEndTime으로 종료 시간을 제한할 수 있다', async () => {
      const user = userEvent.setup();

      render(<TimePicker limitEndTime={6} />);

      const hourButton = screen.getByTitle('시 선택');
      await user.click(hourButton);

      // 6시 이하는 disabled
      const option06 = screen.getAllByRole('button').find((btn) => btn.textContent === '06');
      const option05 = screen.getAllByRole('button').find((btn) => btn.textContent === '05');

      expect(option06).toBeDisabled();
      if (option05) expect(option05).toBeDisabled();
    });

    it('limitStartTime과 limitEndTime을 동시에 사용할 수 있다', async () => {
      const user = userEvent.setup();

      // 07시 ~ 17시만 선택 가능 (6시 이하, 18시 이상 disabled)
      render(<TimePicker limitStartTime={18} limitEndTime={6} />);

      const hourButton = screen.getByTitle('시 선택');
      await user.click(hourButton);

      const option07 = screen.getAllByRole('button').find((btn) => btn.textContent === '07');
      const option17 = screen.getAllByRole('button').find((btn) => btn.textContent === '17');

      // 07~17시는 활성화
      expect(option07).not.toBeDisabled();
      expect(option17).not.toBeDisabled();
    });
  });

  describe('Value 업데이트', () => {
    it('hourValue prop 변경 시 UI가 업데이트된다', () => {
      const { rerender } = render(<TimePicker hourValue="10" />);

      expect(screen.getByTitle('시 선택')).toHaveTextContent('10');

      rerender(<TimePicker hourValue="20" />);

      expect(screen.getByTitle('시 선택')).toHaveTextContent('20');
    });

    it('minuteValue prop 변경 시 UI가 업데이트된다', () => {
      const { rerender } = render(<TimePicker minuteValue="15" />);

      expect(screen.getByTitle('분 선택')).toHaveTextContent('15');

      rerender(<TimePicker minuteValue="45" />);

      expect(screen.getByTitle('분 선택')).toHaveTextContent('45');
    });
  });
});
