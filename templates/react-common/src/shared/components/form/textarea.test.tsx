import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './textarea';

describe('Textarea', () => {
  describe('기본 기능', () => {
    it('텍스트를 입력할 수 있다', async () => {
      const user = userEvent.setup();

      render(<Textarea placeholder="내용 입력" />);

      const textarea = screen.getByPlaceholderText('내용 입력') as HTMLTextAreaElement;

      await user.type(textarea, 'Hello World');

      expect(textarea.value).toBe('Hello World');
    });

    it('onChange 콜백이 호출된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Textarea placeholder="내용 입력" onChange={onChange} />);

      const textarea = screen.getByPlaceholderText('내용 입력');

      await user.type(textarea, 'test');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('maxLength', () => {
    it('maxLength를 적용할 수 있다', async () => {
      const user = userEvent.setup();

      render(<Textarea placeholder="내용 입력" maxLength={10} />);

      const textarea = screen.getByPlaceholderText('내용 입력') as HTMLTextAreaElement;

      // 20자 입력 시도
      await user.type(textarea, '12345678901234567890');

      // 10자까지만 입력됨
      expect(textarea.value.length).toBe(10);
      expect(textarea.value).toBe('1234567890');
    });

    it('maxLength 초과 입력이 방지된다', async () => {
      const user = userEvent.setup();

      render(<Textarea placeholder="내용 입력" maxLength={5} />);

      const textarea = screen.getByPlaceholderText('내용 입력') as HTMLTextAreaElement;

      await user.type(textarea, '1234567890');

      expect(textarea.value).toBe('12345');
    });
  });

  describe('showCount (글자 수 카운터)', () => {
    it('showCount와 maxLength를 함께 사용하면 카운터가 표시된다', () => {
      render(<Textarea placeholder="내용 입력" maxLength={100} showCount />);

      // "0 / 100자" 형식으로 표시
      expect(screen.getByText(/0 \/ 100자/)).toBeInTheDocument();
    });

    it('입력 시 글자 수가 업데이트된다', async () => {
      const user = userEvent.setup();

      render(<Textarea placeholder="내용 입력" maxLength={100} showCount />);

      const textarea = screen.getByPlaceholderText('내용 입력');

      await user.type(textarea, 'Hello');

      expect(screen.getByText(/5 \/ 100자/)).toBeInTheDocument();
    });

    it('showCount=false면 카운터가 표시되지 않는다', () => {
      render(<Textarea placeholder="내용 입력" maxLength={100} showCount={false} />);

      expect(screen.queryByText(/\/ 100자/)).not.toBeInTheDocument();
    });
  });

  describe('한글 입력 (IME Composition)', () => {
    it('한글 입력 중에도 글자 수가 올바르게 카운트된다', async () => {
      const user = userEvent.setup();

      render(<Textarea placeholder="내용 입력" maxLength={10} showCount />);

      const textarea = screen.getByPlaceholderText('내용 입력') as HTMLTextAreaElement;

      // 한글 입력 (IME composition 이벤트 시뮬레이션)
      await user.type(textarea, '안녕하세요');

      // 5글자 입력됨
      expect(textarea.value).toBe('안녕하세요');
      expect(screen.getByText(/5 \/ 10자/)).toBeInTheDocument();
    });
  });

  describe('Paste 입력', () => {
    it('텍스트를 붙여넣을 수 있다', async () => {
      const user = userEvent.setup();

      render(<Textarea placeholder="내용 입력" />);

      const textarea = screen.getByPlaceholderText('내용 입력') as HTMLTextAreaElement;

      await user.click(textarea);
      await user.paste('Pasted content');

      expect(textarea.value).toBe('Pasted content');
    });

    it('maxLength가 적용된 상태에서 paste하면 잘린다', async () => {
      const user = userEvent.setup();

      render(<Textarea placeholder="내용 입력" maxLength={10} />);

      const textarea = screen.getByPlaceholderText('내용 입력') as HTMLTextAreaElement;

      await user.click(textarea);
      await user.paste('This is a very long text');

      // 10자까지만
      expect(textarea.value.length).toBe(10);
    });
  });

  describe('Controlled/Uncontrolled', () => {
    it('value prop으로 제어할 수 있다', () => {
      const { rerender } = render(<Textarea placeholder="내용 입력" value="initial" />);

      const textarea = screen.getByPlaceholderText('내용 입력') as HTMLTextAreaElement;

      expect(textarea.value).toBe('initial');

      rerender(<Textarea placeholder="내용 입력" value="updated" />);

      expect(textarea.value).toBe('updated');
    });

    it('defaultValue로 초기값을 설정할 수 있다', () => {
      render(<Textarea placeholder="내용 입력" defaultValue="default text" />);

      const textarea = screen.getByPlaceholderText('내용 입력') as HTMLTextAreaElement;

      expect(textarea.value).toBe('default text');
    });
  });

  describe('Error 상태', () => {
    it('error 상태를 표시할 수 있다', () => {
      render(
        <Textarea
          placeholder="내용 입력"
          status="error"
          errorMessage="필수 입력 항목입니다"
          showErrorMessage
        />,
      );

      expect(screen.getByText('필수 입력 항목입니다')).toBeInTheDocument();
    });

    it('showErrorMessage=false면 에러 메시지가 숨겨진다', () => {
      render(
        <Textarea
          placeholder="내용 입력"
          status="error"
          errorMessage="에러 메시지"
          showErrorMessage={false}
        />,
      );

      expect(screen.queryByText('에러 메시지')).not.toBeInTheDocument();
    });
  });

  describe('Disabled 상태', () => {
    it('disabled 상태를 적용할 수 있다', () => {
      render(<Textarea placeholder="내용 입력" disabled />);

      const textarea = screen.getByPlaceholderText('내용 입력');

      expect(textarea).toBeDisabled();
    });
  });

  describe('Background variants', () => {
    it('bg="white"가 기본값이다', () => {
      render(<Textarea placeholder="내용 입력" />);

      const textarea = screen.getByPlaceholderText('내용 입력');

      expect(textarea).toHaveClass('bg-white');
    });

    it('bg="gray"를 적용할 수 있다', () => {
      render(<Textarea placeholder="내용 입력" bg="gray" />);

      const textarea = screen.getByPlaceholderText('내용 입력');

      expect(textarea).toHaveClass('bg-gray-100');
    });
  });
});
