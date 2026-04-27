import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePage } from './index';

describe('HomePage', () => {
  it('제목이 렌더링된다', () => {
    render(<HomePage />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('설명 텍스트가 표시된다', () => {
    render(<HomePage />);
    expect(screen.getByText(/프론트엔드 팀 공통/)).toBeInTheDocument();
  });
});
