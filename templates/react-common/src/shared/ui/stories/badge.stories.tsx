import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircleIcon, CheckIcon, XIcon } from 'lucide-react';

import { Badge } from '../badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: '배지 스타일',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: '보조',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: '위험',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: '외곽선',
    variant: 'outline',
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">
        <CheckIcon />
        완료
      </Badge>
      <Badge variant="destructive">
        <XIcon />
        실패
      </Badge>
      <Badge variant="secondary">
        <AlertCircleIcon />
        대기
      </Badge>
    </div>
  ),
};

export const StatusExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="default">활성</Badge>
        <span className="text-sm text-gray-500">활성 상태</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">대기</Badge>
        <span className="text-sm text-gray-500">대기 중</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="destructive">오류</Badge>
        <span className="text-sm text-gray-500">오류 발생</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">미정</Badge>
        <span className="text-sm text-gray-500">미정 상태</span>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Badge asChild variant="default">
      <a href="#">링크 배지</a>
    </Badge>
  ),
};
