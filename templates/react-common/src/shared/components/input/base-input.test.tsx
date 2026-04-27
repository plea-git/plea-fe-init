import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BaseInput } from './base-input';

describe('BaseInput - maxLength 정책', () => {
  describe('기본 maxLength (50자)', () => {
    it('maxLength를 지정하지 않으면 기본 50자까지만 입력된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 50자 입력 - 정상적으로 입력되어야 함
      const text50 = 'a'.repeat(50);
      await user.type(input, text50);

      expect(input.value).toBe(text50);
      expect(input.value.length).toBe(50);
    });

    it('maxLength 기본값(50자)을 초과하는 문자열은 입력되지 않는다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 51자 입력 시도
      const text51 = 'a'.repeat(51);
      await user.type(input, text51);

      // 50자까지만 입력되어야 함
      expect(input.value.length).toBe(50);
      expect(input.value).toBe('a'.repeat(50));
    });

    it('기본값(50자)을 초과하는 텍스트를 paste하면 50자까지만 입력된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 100자 paste
      const text100 = 'a'.repeat(100);
      await user.click(input);
      await user.paste(text100);

      // 50자까지만 입력되어야 함
      expect(input.value.length).toBe(50);
      expect(input.value).toBe('a'.repeat(50));
    });
  });

  describe('커스텀 maxLength', () => {
    it('maxLength가 10이면 10자까지만 입력된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={10} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 10자 입력 - 정상적으로 입력되어야 함
      await user.type(input, '1234567890');

      expect(input.value).toBe('1234567890');
      expect(input.value.length).toBe(10);
    });

    it('maxLength를 초과하는 문자열은 입력되지 않는다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={10} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 15자 입력 시도
      await user.type(input, '123456789012345');

      // 10자까지만 입력되어야 함
      expect(input.value.length).toBe(10);
      expect(input.value).toBe('1234567890');
    });

    it('maxLength를 초과하는 텍스트를 paste하면 maxLength까지만 입력된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={5} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 10자 paste
      await user.click(input);
      await user.paste('1234567890');

      // 5자까지만 입력되어야 함
      expect(input.value.length).toBe(5);
      expect(input.value).toBe('12345');
    });

    it('중간에 텍스트를 paste해도 maxLength를 초과하지 않는다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={10} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 먼저 5자 입력
      await user.type(input, 'hello');
      expect(input.value).toBe('hello');

      // 커서를 맨 뒤로 이동 후 10자 paste
      await user.click(input);
      input.setSelectionRange(5, 5);
      await user.paste('1234567890');

      // 총 10자까지만 입력되어야 함 (hello + 12345)
      expect(input.value.length).toBe(10);
      expect(input.value).toBe('hello12345');
    });
  });

  describe('다국어 및 특수문자 처리', () => {
    it('한글 입력 시 maxLength가 올바르게 동작한다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={5} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 5글자 한글 입력
      await user.type(input, '안녕하세요');

      expect(input.value).toBe('안녕하세요');
      expect(Array.from(input.value).length).toBe(5);
    });

    it('이모지 입력 시 maxLength가 올바르게 동작한다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={5} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 이모지 5개 paste
      await user.click(input);
      await user.paste('😀😁😂🤣😃😄😅');

      // 5개까지만 입력되어야 함
      expect(Array.from(input.value).length).toBe(5);
      expect(input.value).toBe('😀😁😂🤣😃');
    });

    it('한글+영문 혼합 시 maxLength가 올바르게 동작한다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={10} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 혼합 텍스트 paste
      await user.click(input);
      await user.paste('hello안녕world');

      // 10글자까지만 입력
      expect(Array.from(input.value).length).toBe(10);
      expect(input.value).toBe('hello안녕wor');
    });
  });

  describe('onChange 콜백', () => {
    it('유효한 입력 시 onChange가 호출된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={10} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      await user.type(input, 'hello');

      // 각 글자마다 onChange 호출
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls.length).toBeGreaterThan(0);
    });

    it('maxLength를 초과하는 입력은 이전 값으로 복구된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" maxLength={5} onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 먼저 5자 입력
      await user.type(input, '12345');
      expect(input.value).toBe('12345');

      // 추가로 1자 더 입력 시도
      await user.type(input, '6');

      // 값은 여전히 5자여야 함 (maxLength 초과 방지)
      expect(input.value).toBe('12345');
      expect(input.value.length).toBe(5);
    });
  });

  describe('Clear 기능', () => {
    it('입력된 값이 있고 포커스된 상태에서 clear 버튼이 표시된다', async () => {
      const user = userEvent.setup();

      render(<BaseInput placeholder="텍스트 입력" />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 텍스트 입력
      await user.type(input, 'hello');

      // Clear 버튼 확인 (XIcon 버튼)
      const clearButton = input.parentElement?.querySelector('button');
      expect(clearButton).toBeTruthy();
    });

    it('clear 버튼 클릭 시 입력값이 초기화된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<BaseInput placeholder="텍스트 입력" onChange={onChange} />);

      const input = screen.getByPlaceholderText('텍스트 입력') as HTMLInputElement;

      // 텍스트 입력
      await user.type(input, 'hello');
      expect(input.value).toBe('hello');

      // Clear 버튼 클릭
      const clearButton = input.parentElement?.querySelector('button');
      if (clearButton) {
        await user.click(clearButton);
      }

      // 값이 초기화되어야 함
      expect(input.value).toBe('');
    });
  });
});
