import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Plus, Search } from 'lucide-react';

import { Button } from '../button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'gray',
        'white',
        'stress',
      ],
      description: '버튼 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
      description: '버튼 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    asChild: {
      control: 'boolean',
      description: 'Slot 컴포넌트로 렌더링',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '버튼',
    variant: 'default',
    size: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: '삭제',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: '취소',
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    children: '보조 버튼',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: '링크 버튼',
    variant: 'link',
  },
};

export const Gray: Story = {
  args: {
    children: '회색 버튼',
    variant: 'gray',
  },
};

export const White: Story = {
  args: {
    children: '흰색 버튼',
    variant: 'white',
  },
};

export const Stress: Story = {
  args: {
    children: '강조 버튼',
    variant: 'stress',
  },
};

export const ExtraSmall: Story = {
  args: {
    children: 'XS 버튼',
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    children: 'SM 버튼',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'LG 버튼',
    size: 'lg',
  },
};

export const IconOnly: Story = {
  args: {
    children: <Plus className="size-4" />,
    size: 'icon',
    'aria-label': '추가',
  },
};

export const IconExtraSmall: Story = {
  args: {
    children: <Search className="size-4" />,
    size: 'icon-xs',
    'aria-label': '검색',
  },
};

export const IconLarge: Story = {
  args: {
    children: <Plus className="size-5" />,
    size: 'icon-lg',
    'aria-label': '추가',
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="size-4" />
        추가하기
      </>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: (
      <>
        다음으로
        <ArrowRight className="size-4" />
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="gray">Gray</Button>
      <Button variant="white">White</Button>
      <Button variant="stress">Stress</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="default">Default</Button>
      <Button size="lg">LG</Button>
      <Button size="icon">
        <Plus className="size-4" />
      </Button>
      <Button size="icon-xs">
        <Plus className="size-4" />
      </Button>
      <Button size="icon-sm">
        <Plus className="size-4" />
      </Button>
      <Button size="icon-lg">
        <Plus className="size-5" />
      </Button>
    </div>
  ),
};
