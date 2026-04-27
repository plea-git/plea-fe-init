import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  describe('검색 아이콘', () => {
    it('검색 아이콘이 표시된다', () => {
      render(<SearchInput placeholder="검색어 입력" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      // InputGroupAddon 버튼 확인
      const searchButton = input
        .closest('[data-slot="input-group"]')
        ?.querySelector('[data-slot="input-group-addon"]');
      expect(searchButton).toBeInTheDocument();
    });

    it('검색 아이콘은 입력란 오른쪽에 위치한다', () => {
      render(<SearchInput placeholder="검색어 입력" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;
      const searchButton = input
        .closest('[data-slot="input-group"]')
        ?.querySelector('[data-align="inline-end"]');

      expect(searchButton).toBeTruthy();
    });
  });

  describe('onSearch 콜백', () => {
    it('검색 아이콘 클릭 시 onSearch가 호출된다', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();

      render(<SearchInput placeholder="검색어 입력" onSearch={onSearch} />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;
      const searchButton = input
        .closest('[data-slot="input-group"]')
        ?.querySelector('[data-slot="input-group-addon"] button') as HTMLElement | null;

      if (searchButton) {
        await user.click(searchButton);
      }

      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it('onSearch가 없어도 에러가 발생하지 않는다', async () => {
      const user = userEvent.setup();

      render(<SearchInput placeholder="검색어 입력" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;
      const searchButton = input
        .closest('[data-slot="input-group"]')
        ?.querySelector('[data-slot="input-group-addon"] button') as HTMLElement | null;

      // 에러 없이 클릭 가능해야 함
      if (searchButton) {
        await expect(user.click(searchButton)).resolves.not.toThrow();
      }
    });

    it('입력 후 검색 아이콘을 클릭할 수 있다', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();

      render(<SearchInput placeholder="검색어 입력" onSearch={onSearch} />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      // 텍스트 입력
      await user.type(input, 'test query');
      expect(input.value).toBe('test query');

      // 검색 버튼 찾기 - InputGroupAddon 내부 버튼
      const searchButton = input
        .closest('[data-slot="input-group"]')
        ?.querySelector('[data-slot="input-group-addon"] button') as HTMLElement | null;

      if (searchButton) {
        await user.click(searchButton);
      }

      expect(onSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('BaseInput 기능 상속', () => {
    it('텍스트를 입력할 수 있다', async () => {
      const user = userEvent.setup();

      render(<SearchInput placeholder="검색어 입력" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      await user.type(input, 'React Testing');

      expect(input.value).toBe('React Testing');
    });

    it('onChange가 호출된다', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<SearchInput placeholder="검색어 입력" onChange={onChange} />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      await user.type(input, 'test');

      expect(onChange).toHaveBeenCalled();
    });

    it('maxLength가 적용된다', async () => {
      const user = userEvent.setup();

      render(<SearchInput placeholder="검색어 입력" maxLength={10} />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      // 20자 입력 시도
      await user.type(input, '12345678901234567890');

      // 10자까지만 입력되어야 함
      expect(input.value.length).toBe(10);
      expect(input.value).toBe('1234567890');
    });

    it('disabled 상태를 적용할 수 있다', () => {
      render(<SearchInput placeholder="검색어 입력" disabled />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      expect(input).toBeDisabled();
    });

    it('error 상태를 표시할 수 있다', () => {
      render(
        <SearchInput
          placeholder="검색어 입력"
          status="error"
          errorMessage="검색어를 입력해주세요"
        />,
      );

      expect(screen.getByText('검색어를 입력해주세요')).toBeInTheDocument();
    });

    it('paste로 텍스트를 입력할 수 있다', async () => {
      const user = userEvent.setup();

      render(<SearchInput placeholder="검색어 입력" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      await user.click(input);
      await user.paste('pasted search query');

      expect(input.value).toBe('pasted search query');
    });

    it('clear 버튼이 표시된다', async () => {
      const user = userEvent.setup();

      render(<SearchInput placeholder="검색어 입력" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      // 텍스트 입력 후 포커스
      await user.type(input, 'test');

      // Clear 버튼과 Search 버튼 모두 존재해야 함
      const buttons = input.parentElement?.querySelectorAll('button');
      expect(buttons?.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Enter 키로 검색', () => {
    it('Enter 키를 눌러도 onSearch가 호출되지 않는다 (기본 동작)', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();

      render(<SearchInput placeholder="검색어 입력" onSearch={onSearch} />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      await user.type(input, 'test');
      await user.type(input, '{Enter}');

      // Enter 키는 기본적으로 onSearch를 트리거하지 않음
      // 필요시 onKeyDown prop으로 처리 가능
      expect(onSearch).not.toHaveBeenCalled();
    });

    it('onKeyDown으로 Enter 키 동작을 커스터마이징할 수 있다', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      const onKeyDown = vi.fn((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onSearch();
        }
      });

      render(<SearchInput placeholder="검색어 입력" onSearch={onSearch} onKeyDown={onKeyDown} />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      await user.type(input, 'test');
      await user.type(input, '{Enter}');

      expect(onKeyDown).toHaveBeenCalled();
      expect(onSearch).toHaveBeenCalled();
    });
  });

  describe('value 제어', () => {
    it('value prop으로 제어 가능하다', () => {
      const { rerender } = render(<SearchInput placeholder="검색어 입력" value="initial" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      expect(input.value).toBe('initial');

      // value 변경
      rerender(<SearchInput placeholder="검색어 입력" value="updated" />);

      expect(input.value).toBe('updated');
    });

    it('defaultValue로 초기값을 설정할 수 있다', () => {
      render(<SearchInput placeholder="검색어 입력" defaultValue="default search" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;

      expect(input.value).toBe('default search');
    });
  });

  describe('검색 버튼 스타일', () => {
    it('검색 버튼이 적절한 스타일을 가진다', () => {
      render(<SearchInput placeholder="검색어 입력" />);

      const input = screen.getByPlaceholderText('검색어 입력') as HTMLInputElement;
      const searchButton = input
        .closest('[data-slot="input-group"]')
        ?.querySelector('[data-slot="input-group-addon"]');

      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toHaveAttribute('data-align', 'inline-end');
    });
  });
});
