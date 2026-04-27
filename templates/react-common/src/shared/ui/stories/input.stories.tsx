import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '../input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'default'],
      description: '입력 필드 크기',
    },
    bg: {
      control: 'select',
      options: ['white', 'gray'],
      description: '배경색',
    },
    status: {
      control: 'select',
      options: ['default', 'error'],
      description: '상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
  },
};

export const Small: Story = {
  args: {
    placeholder: '작은 입력',
    inputSize: 'sm',
  },
};

export const GrayBackground: Story = {
  args: {
    placeholder: '회색 배경',
    bg: 'gray',
  },
};

export const Error: Story = {
  args: {
    placeholder: '에러 상태',
    status: 'error',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: '읽기 전용 텍스트',
    readOnly: true,
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: '입력된 텍스트',
  },
};

export const NumberType: Story = {
  args: {
    type: 'number',
    placeholder: '숫자 입력',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[300px] flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Default</span>
        <Input placeholder="기본 입력" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Small</span>
        <Input placeholder="작은 입력" inputSize="sm" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Gray Background</span>
        <Input placeholder="회색 배경" bg="gray" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Error</span>
        <Input placeholder="에러 상태" status="error" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Disabled</span>
        <Input placeholder="비활성화" disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">Read Only</span>
        <Input defaultValue="읽기 전용" readOnly />
      </div>
    </div>
  ),
};
