import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Settings, User } from 'lucide-react';

import { Separator } from '../separator';

const meta = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '구분선 방향',
    },
    decorative: {
      control: 'boolean',
      description: '장식용 여부 (스크린 리더에서 무시됨)',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 horizontal 구분선
export const Default: Story = {
  args: {
    orientation: 'horizontal',
    decorative: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

// 세로 방향 구분선
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    decorative: true,
  },
  decorators: [
    (Story) => (
      <div className="flex h-20">
        <Story />
      </div>
    ),
  ],
};

// 리스트 아이템 사이 구분선
export const InList: Story = {
  render: () => (
    <div className="w-[300px] space-y-1">
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

// 텍스트와 함께 사용하는 구분선
export const WithText: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Separator />
        </div>
        <span className="text-muted-foreground text-sm">또는</span>
        <div className="flex-1">
          <Separator />
        </div>
      </div>
    </div>
  ),
};

// 메뉴 아이템 사이 구분선
export const InMenu: Story = {
  render: () => (
    <div className="bg-background w-[200px] space-y-1 rounded-md border p-2">
      <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm">
        <User className="size-4" />
        프로필
      </div>
      <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm">
        <Mail className="size-4" />
        메시지
      </div>
      <Separator className="my-1" />
      <div className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm">
        <Settings className="size-4" />
        설정
      </div>
    </div>
  ),
};

// 세로 구분선 - 툴바
export const VerticalToolbar: Story = {
  render: () => (
    <div className="bg-background flex h-10 items-center gap-2 rounded-md border px-3">
      <button className="hover:bg-accent px-2 py-1 text-sm">저장</button>
      <Separator orientation="vertical" className="h-6" />
      <button className="hover:bg-accent px-2 py-1 text-sm">내보내기</button>
      <Separator orientation="vertical" className="h-6" />
      <button className="hover:bg-accent px-2 py-1 text-sm">공유</button>
    </div>
  ),
};

// 섹션 구분선
export const SectionDivider: Story = {
  render: () => (
    <div className="w-[500px] space-y-6">
      <section>
        <h3 className="mb-2 text-lg font-semibold">계정 정보</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">이메일</span>
            <span>user@example.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">가입일</span>
            <span>2024.01.01</span>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="mb-2 text-lg font-semibold">보안 설정</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">2단계 인증</span>
            <span>활성화</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">마지막 비밀번호 변경</span>
            <span>2024.12.01</span>
          </div>
        </div>
      </section>
    </div>
  ),
};

// 커스텀 스타일 구분선
export const CustomStyles: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <p className="text-muted-foreground mb-2 text-sm">기본 구분선</p>
        <Separator />
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">두꺼운 구분선</p>
        <Separator className="h-0.5" />
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">점선 구분선</p>
        <Separator className="border-dashed" style={{ borderTopWidth: '1px', height: 0 }} />
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">색상 구분선</p>
        <Separator className="bg-primary" />
      </div>
    </div>
  ),
};

// 모든 방향 보기
export const AllOrientations: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="space-y-4">
        <p className="text-sm font-medium">Horizontal</p>
        <div className="w-[200px]">
          <Separator orientation="horizontal" />
        </div>
      </div>

      <div className="flex gap-4">
        <p className="text-sm font-medium">Vertical</p>
        <div className="h-20">
          <Separator orientation="vertical" />
        </div>
      </div>
    </div>
  ),
};
